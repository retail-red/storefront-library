import intlTelInput from 'intl-tel-input';
// Static file import
import utilsScript from '../static/utils';
import Controller from './controller';
import {
  t, hasTranslation, getCountries, getActiveLanguage,
} from '../locales';
import { isRequired, isEmail, isPhone } from '../util/validation';
import Cache, { locationInventoryKey } from '../cache';

const formData = {
  firstName: 'rr-reserve-first-name',
  lastName: 'rr-reserve-last-name',
  phone: 'rr-reserve-phone-number',
  emailAddress: 'rr-reserve-email',
  country: 'rr-reserve-country',
  pickupFirstName: 'rr-reserve-pickup-first-name',
  pickupLastName: 'rr-reserve-pickup-last-name',
  pickupPhone: 'rr-reserve-pickup-phone-number',
  pickupEmailAddress: 'rr-reserve-pickup-email',
  pickupCountry: 'rr-reserve-pickup-country',
  remember: 'rr-reserve-persist-data-opt-in',
  customerNotes: 'rr-reserve-customer-notes',
};

const validation = {
  firstName: { isRequired },
  lastName: { isRequired },
  phone: { isRequired, isPhone },
  emailAddress: { isRequired, isEmail },
};

const pickupValidation = {
  pickupFirstName: { isRequired },
  pickupLastName: { isRequired },
  pickupPhone: { isRequired, isPhone },
  pickupEmailAddress: { isRequired, isEmail },
};

class ReserveController extends Controller {
  constructor(routeName, templateName, app, config, sdk) {
    super(routeName, templateName, app, config, sdk, 'rr-modal-inner');
  }

  getTitle() {
    return t('reserve.title');
  }

  updateConfig(config, changed) {
    super.updateConfig(config, changed);
    if (changed.locationCode) {
      const cachedLocation = Cache.get(locationInventoryKey(changed.locationCode));
      this.state.location = cachedLocation || this.state.location;
    }
  }

  async load({
    location, product, showHeader = true, showLocation = true,
  }) {
    const {
      customer, legal, newsletterOptIn, saveCustomerData, useApiProduct,
    } = this.config;

    return {
      showHeader,
      showLocation,
      location,
      legal,
      newsletterOptIn: {
        enabled: ['enabled', 'enabledAndPreselected'].includes(newsletterOptIn),
        preselected: newsletterOptIn === 'enabledAndPreselected',
      },
      persistDataOptIn: {
        enabled: saveCustomerData === 'checkbox',
        preselected: customer.remember === true,
      },
      product,
      isApiProduct: useApiProduct,
      formData: {
        ...customer,
        pickupFirstName: '',
        pickupLastName: '',
        pickupEmailAddress: '',
        pickupPhone: '',
        pickupCountry: '',
        customerNotes: '',
      },
    };
  }

  prefillFormData() {
    Object.entries(formData).forEach(([formField, id]) => {
      const field = document.querySelector(`#${id}`);
      if (!field) return;

      const { type } = field;
      const value = this.state.formData[formField];

      if (type === 'checkbox') {
        field.checked = [true, false].includes(value) ? value : false;
      } else {
        field.value = value;
      }
    });
  }

  initIntlTelInput(input, extraOptions = {}) {
    const initialCountry = (this.config.customer.country || '').toLowerCase();

    return intlTelInput(input, {
      initialCountry: initialCountry || 'auto',
      localizedCountries: getCountries() || {},
      nationalMode: true,
      utilsScript,
      ...(Array.isArray(this.config?.localization?.countries) && {
        preferredCountries: this.config?.localization?.countries,
      }),
      ...(this.isMobile && {
        dropdownContainer: document.querySelector('.rr-iti-mobile-dropdown-container'),
      }),
      ...extraOptions,
    });
  }

  syncCustomerData() {
    const stored = ['firstName', 'lastName', 'phone', 'emailAddress', 'country', 'remember'];
    stored.forEach((property) => {
      const element = document.querySelector(`#${formData[property]}`);
      if (!element) return;
      const { type } = element;
      const event = type === 'checkbox' ? 'change' : 'blur';

      element.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const value = type === 'checkbox' ? e.target.checked : e.target.value;

        this.app.publicInterface.updateConfig({ customer: { [property]: value } });
      });
    });
  }

  getOrderLocaleCode() {
    const { localization: { localeCode } } = this.config;

    if (/^[a-z]{2}-[a-z]{2}$/i.test(localeCode)) {
      // Use locale from config when it includes a region
      return localeCode.toLowerCase();
    }

    return getActiveLanguage(true);
  }

  sanitizeOrderTrackingData(orderData) {
    const {
      addressSequences,
      primaryBillToAddressSequenceIndex,
      primaryShipToAddressSequenceIndex,
      ...trackingData
    } = orderData;

    trackingData.lineItems = trackingData.lineItems.map((lineItem) => {
      const { shipToAddressSequenceIndex, ...entry } = lineItem;
      return entry;
    });

    return trackingData;
  }

  async submit() {
    const { platform } = this.config;
    const { location, product } = this.state;

    // Retrieve form data from document.
    const submitData = Object.assign({}, ...Object
      .entries(formData)
      .map(([name, id]) => {
        const element = document.querySelector(`#${id}`);
        if (!element) {
          return null;
        }

        return ({ [name]: element.value });
      }).filter(Boolean));
    const customPickupPerson = !document.querySelector('#rr-reserve-pickup-me').checked;
    let marketingOptIn;

    if (document.querySelector('#rr-reserve-newsletter-opt-in')) {
      marketingOptIn = !!document.querySelector('#rr-reserve-newsletter-opt-in').checked;
    }

    // Handle validation.
    const validationRules = { ...validation, ...(customPickupPerson ? pickupValidation : {}) };
    let isValid = true;
    let firstError = null;
    Object.entries(validationRules).forEach(([property, rules]) => {
      const [, elementId] = Object.entries(formData).find(([name]) => name === property);
      const elementError = document.querySelector(`.${elementId}-error`);

      Object.entries(rules).forEach(([ruleName, ruleEval]) => {
        const outcome = ruleEval(submitData[property]);
        if (!outcome) {
          elementError.innerText = t(`errors.validation.${ruleName}`);
          isValid = false;
          if (!firstError) {
            /**
             * When the textFieldPhone partial is used for the phone number fields, the input for
             * the elementId is a hidden input which can't be targeted by scrollIntoView().
             * Therefore we need to manipulate the elementId and add a "-user" suffix to target the
             * visible input.
             */
            if (typeof elementId === 'string' && elementId.includes('phone-number') && document.querySelector(`#${elementId}-user`)) {
              firstError = `${elementId}-user`;
            } else {
              firstError = elementId;
            }
          }
          return;
        }

        elementError.innerText = '';
      });
    });

    if (!isValid) {
      document.querySelector(`#${firstError}`).scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Build basic order.
    const orderPrice = Math.round(product.price * product.quantity * 100) / 100;
    const productPrice = Math.round(product.price * 100) / 100;

    let orderOptions;

    if (Array.isArray(product.options)) {
      // Check if the options have the correct format to use them at order creation
      const optionsValid = product.options.every(({ code, name, value }) => {
        if (typeof value !== 'object' || value === null) {
          return false;
        }

        return [code, name, value.code, value.name].every((entry) => entry !== undefined);
      });

      if (optionsValid) {
        orderOptions = product.options;
      }
    }

    const orderData = {
      platform: platform || undefined,
      currencyCode: product.currencyCode,
      localeCode: this.getOrderLocaleCode(),
      ...(typeof marketingOptIn !== 'undefined' ? { marketingOptIn } : {}),
      addressSequences: [
        {
          type: 'billing',
          firstName: submitData.firstName,
          lastName: submitData.lastName,
          phone: submitData.phone,
          emailAddress: submitData.emailAddress,
          country: submitData.country,
        },
        {
          type: 'pickup',
          firstName: submitData.firstName,
          lastName: submitData.lastName,
          phone: submitData.phone,
          emailAddress: submitData.emailAddress,
          country: submitData.country,
        },
      ],
      lineItems: [{
        code: product.code,
        quantity: product.quantity,
        fulfillmentMethod: 'ROPIS',
        fulfillmentLocationCode: location.code,
        shipToAddressSequenceIndex: 1,
        currencyCode: product.currencyCode,
        price: productPrice,
        product: {
          code: product.code,
          name: product.name,
          image: product.imageUrl,
          price: productPrice,
          currencyCode: product.currencyCode,
          options: orderOptions,
          ...(product.identifiers ? {
            identifiers: {
              ean: product.identifiers.ean,
              isbn: product.identifiers.isbn,
              sku: product.identifiers.sku,
              upc: product.identifiers.upc,
              distiPartNum: product.identifiers.distiPartNum,
              mfgPartNum: product.identifiers.mfgPartNum,
            },
          } : {}),
        },
      }],
      subTotal: orderPrice,
      total: orderPrice,
      primaryBillToAddressSequenceIndex: 0,
      primaryShipToAddressSequenceIndex: 1,
      ...(submitData.customerNotes ? { notes: submitData.customerNotes } : null),
    };

    // Append external customer number if available.
    if (this.config.customer.code) {
      orderData.externalCustomerNumber = `${this.config.customer.code}`;
    }

    // Custom pickup person.
    if (customPickupPerson) {
      orderData.addressSequences[1] = {
        ...orderData.addressSequences[1],
        firstName: submitData.pickupFirstName,
        lastName: submitData.pickupLastName,
        phone: submitData.pickupPhone,
        emailAddress: submitData.pickupEmailAddress,
        country: submitData.pickupCountry,
      };
    }

    // Submit to API.
    try {
      this.app.setLoading(true);
      const { orderNumbers, errors } = await this.sdk.createOrder(orderData);
      if (errors && errors.length) {
        const specific = `errors.${errors[0].code}`;
        // eslint-disable-next-line no-alert
        alert(hasTranslation() ? t(specific) : t('errors.unknown'));
        return;
      }

      this.app.publicInterface._triggerEvent('orderCreated', {
        order: this.sanitizeOrderTrackingData(orderData),
      });

      this.app.pushEndRoute('success', { location, reservationNumber: orderNumbers[0] });
    } catch (ex) {
      // eslint-disable-next-line no-alert
      alert(t('errors.unknown'));
    }
    this.app.setLoading(false);
  }
}

ReserveController.templateName = 'reserve';
ReserveController.routeName = 'reserve';

export default ReserveController;

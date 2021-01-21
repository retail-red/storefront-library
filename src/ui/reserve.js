import Controller from './controller';
import { t, hasTranslation } from '../locales';
import { isRequired, isEmail, isPhone } from '../util/validation';

const formData = {
  firstName: 'rr-reserve-first-name',
  lastName: 'rr-reserve-last-name',
  phone: 'rr-reserve-phone-number',
  emailAddress: 'rr-reserve-email',
  pickupFirstName: 'rr-reserve-pickup-first-name',
  pickupLastName: 'rr-reserve-pickup-last-name',
  pickupPhone: 'rr-reserve-pickup-phone-number',
  pickupEmailAddress: 'rr-reserve-pickup-email',
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
  getTitle() {
    return t('reserve.title');
  }

  async load({ location, product }) {
    const { customer, legal } = this.config;
    return {
      location,
      legal,
      product,
      formData: {
        ...customer,
        pickupFirstName: '',
        pickupLastName: '',
        pickupEmailAddress: '',
        pickupPhone: '',
      },
    };
  }

  prefillFormData() {
    Object.entries(formData).forEach(([formField, id]) => {
      const field = document.querySelector(`#${id}`);
      field.value = this.state.formData[formField];
    });
  }

  async submit() {
    const { product } = this.config;
    const { location } = this.state;

    // Retrieve form data from document.
    const submitData = Object.assign({}, ...Object
      .entries(formData)
      .map(([name, id]) => ({ [name]: document.querySelector(`#${id}`).value })));
    const customPickupPerson = !document.querySelector('#rr-reserve-pickup-me').checked;

    // Handle validation.
    const validationRules = { ...validation, ...(customPickupPerson ? pickupValidation : {}) };
    const isValid = Object.entries(validationRules).every(([property, rules]) => {
      const [, elementId] = Object.entries(formData).find(([name]) => name === property);
      const elementError = document.querySelector(`.${elementId}-error`);

      return Object.entries(rules).every(([ruleName, ruleEval]) => {
        const outcome = ruleEval(submitData[property]);
        if (!outcome) {
          elementError.classList.remove('rr-hidden');
          elementError.innerText = t(`errors.validation.${ruleName}`);
          return false;
        }
        elementError.classList.add('rr-hidden');
        return outcome;
      });
    });
    if (!isValid) return;

    // Build basic order.
    const orderPrice = Math.round(product.price * product.quantity * 100) / 100;
    const productPrice = Math.round(product.price * 100) / 100;
    const orderData = {
      currencyCode: product.currencyCode,
      localeCode: location.localeCode,
      addressSequences: [
        {
          type: 'billing',
          firstName: submitData.firstName,
          lastName: submitData.lastName,
          phone: submitData.phone,
          emailAddress: submitData.emailAddress,
        },
        {
          type: 'pickup',
          firstName: submitData.firstName,
          lastName: submitData.lastName,
          phone: submitData.phone,
          emailAddress: submitData.emailAddress,
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
        },
      }],
      subTotal: orderPrice,
      total: orderPrice,
      primaryBillToAddressSequenceIndex: 0,
      primaryShipToAddressSequenceIndex: 1,
    };

    // Append external customer number if available.
    if (this.config.customer.code) {
      orderData.externalCustomerNumber = this.config.customer.code;
    }

    // Custom pickup person.
    if (customPickupPerson) {
      orderData.addressSequences[1] = {
        ...orderData.addressSequences[1],
        firstName: submitData.pickupFirstName,
        lastName: submitData.pickupLastName,
        phone: submitData.pickupPhone,
        emailAddress: submitData.pickupEmailAddress,
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
      this.app.resetTo('success', { location, reservationNumber: orderNumbers[0] });
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

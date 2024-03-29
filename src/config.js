import handlebars from 'handlebars';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import get from 'lodash/get';
import set from 'lodash/set';
import noop from 'lodash/noop';
import { getBrowserLanguage } from './util/browser';
import { getExtraDefaultConfig, getExtraStoredConfig } from './internal';

const requiredProperties = [
  'apiKey',
];
const requiredRenderProperties = [
  ...requiredProperties,
];
const requiredProductProperties = [
  'product.code',
  'product.name',
  'product.quantity',
  'product.price',
  'product.currencyCode',
];

const requiredRenderPropertiesApiProduct = [
  'product.code',
  'product.quantity',
];

const storedProperties = [
  'locationCode',
  'customer.firstName',
  'customer.lastName',
  'customer.phone',
  'customer.emailAddress',
  'customer.country',
  'customer.remember',
  ...getExtraStoredConfig(),
];

// Load default config from location code.
const LOCAL_STORAGE_KEY = 'rr-config-v2';
let storedConfig = {};
try {
  const storedConfigString = window.localStorage.getItem(LOCAL_STORAGE_KEY) || '{}';
  storedConfig = JSON.parse(storedConfigString);
} catch (err) {
  // Ignore local storage access issues
}

const defaultConfig = merge({
  apiStage: 'production',
  locationCode: null,
  postalCode: null,
  unitSystem: 'metric',
  browserHistory: true,
  useGeolocationImmediately: true,
  useApiProduct: false,
  saveCustomerData: 'on',
  testMode: false,
  platform: null,
  newsletterOptIn: 'disabled',
  customer: {
    code: null,
    firstName: '',
    lastName: '',
    phone: '',
    emailAddress: '',
    country: 'DE',
  },
  legal: {
    terms: null,
    privacy: null,
  },
  inventory: {
    hideNumber: false,
    showExactUntil: Number.MAX_VALUE,
    showLowUntil: 5,
  },
  localization: {
    localeCode: getBrowserLanguage(),
    countries: ['de'],
    countryCode: null,
  },
  ui: {
    reserveButtonClasses: 'rr-omni-reserve-button button btn btn-primary',
  },
  templates: {
    customVariables: {},
    customTemplates: {},
  },
  hooks: {
    afterCreateStoreListLocations: noop,
  },
}, getExtraDefaultConfig(), storedConfig);

/**
 * Creates a new config object with merged defaults and validation.
 * @param {Object} config Incoming config
 * @param {Object} previous Previous configuration that is updated.
 * @returns {Object}
 */
export const createConfig = (config = {}, previous = null) => {
  // Merge with defaults.
  const merged = mergeWith({}, defaultConfig, previous, config, (objValue, srcValue, key) => {
    if (key === 'countries' && previous !== null) {
      // Do not merge countries arrays, but return the new value
      return srcValue;
    }

    return undefined;
  });
  requiredProperties.forEach((property) => {
    if (!get(merged, property)) {
      // eslint-disable-next-line no-console
      console.error(`[SG Enablement] The property '${property}' is required for initialization`);
    }
  });
  // Compile custom templates that have not been compiled yet.
  Object.entries(merged.templates.customTemplates)
    .filter(([, template]) => typeof template === 'string')
    .forEach(([name, template]) => {
      const compiled = handlebars.compile(template);
      merged.templates.customTemplates[name] = compiled;
    });

  // Post processing of config
  merged.inventory.showExactUntil = merged.inventory.showExactUntil === null
    ? Number.MAX_VALUE : merged.inventory.showExactUntil;

  // Check if locale code comes from the config (not set automatically)
  merged.localization.isCustomLocaleCode = !!previous?.localization?.isCustomLocaleCode
    || !!config?.localization?.localeCode;

  // Store config in local storage.
  const toBeStored = {};
  storedProperties.forEach((property) => {
    set(toBeStored, property, get(merged, property));
  });

  if (merged.saveCustomerData === 'off' || (merged.saveCustomerData === 'checkbox' && toBeStored.customer.remember !== true)) {
    delete toBeStored.customer;
  }

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toBeStored));
  } catch (err) {
    // Ignore local storage access issues
  }

  return merged;
};

/**
 * Validates the given config for the rendering phase.
 * @param {Object} config Config to be validated.
 */
export const validateConfigForRendering = (config) => requiredRenderProperties.every((property) => {
  if (!get(config, property)) {
    // eslint-disable-next-line no-console
    console.error(`[SG Enablement] The property '${property}' is required and needs to be set before calling the render functions`);
    return false;
  }
  return true;
});

export const validateConfigForProduct = (config, logErrors = true) => {
  let required = requiredProductProperties;

  if (config?.useApiProduct === true) {
    required = requiredRenderPropertiesApiProduct;
  }

  return required.every((property) => {
    if (!get(config, 'product') || config.product === null) {
      return false;
    }

    if (!get(config, property)) {
      if (logErrors) {
      // eslint-disable-next-line no-console
        console.error(
          `[SG Enablement] The property '${property}' is required and needs to be set before calling the render functions`,
        );
      }

      return false;
    }
    return true;
  });
};

/**
 * Validates the given config for the rendering phase.
 * @param {Object} config Config to be validated.
 */
export const isButtonDisabled = (config) => !validateConfigForProduct(config, false);

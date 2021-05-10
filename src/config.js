import handlebars from 'handlebars';
import merge from 'lodash/merge';
import get from 'lodash/get';
import set from 'lodash/set';
import { getBrowserLanguage } from './util/browser';
import { getExtraDefaultConfig, getExtraStoredConfig } from './internal';

const requiredProperties = [
  'apiKey',
];
const requiredRenderProperties = [
  ...requiredProperties,
  'product.code',
  'product.name',
  'product.quantity',
  'product.price',
  'product.currencyCode',
];
const storedProperties = [
  'locationCode',
  'customer.firstName',
  'customer.lastName',
  'customer.phone',
  'customer.emailAddress',
  'customer.country',
  ...getExtraStoredConfig(),
];

// Load default config from location code.
const LOCAL_STORAGE_KEY = 'rr-config-v1';
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
  unitSystem: 'metric',
  browserHistory: true,
  useGeolocationImmediately: true,
  testMode: false,
  platform: null,
  customer: {
    code: null,
    firstName: '',
    lastName: '',
    phone: '',
    emailAddress: '',
    country: 'DE',
    remember: true,
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
  },
  templates: {
    customVariables: {},
    customTemplates: {},
  },
}, getExtraDefaultConfig(), storedConfig);

/**
 * Creates a new config object with merged defaults and validation.
 * @param {Object} config Incoming config
 * @param {Object} previous Previous configuration that is updated.
 * @returns {Object}
 */
export const createConfig = (config = {}, previous = {}) => {
  // Merge with defaults.
  const merged = merge({}, defaultConfig, previous, config);
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

  // Store config in local storage.
  const toBeStored = {};
  storedProperties.forEach((property) => {
    set(toBeStored, property, get(merged, property));
  });
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

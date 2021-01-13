import handlebars from 'handlebars';
import defaultsDeep from 'lodash/defaultsDeep';
import get from 'lodash/get';
import { getBrowserLanguage } from './util/browser';

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

const defaultConfig = {
  apiStage: 'production',
  locationCode: null,
  customer: {
    firstName: '',
    lastName: '',
    phone: '',
    emailAddress: '',
  },
  localization: {
    localeCode: getBrowserLanguage(),
    countries: ['de'],
  },
  templates: {
    customVariables: {},
    customTemplates: {},
  },
};

/**
 * Creates a new config object with merged defaults and validation.
 * @param {Object} config Incoming config
 * @param {Object} previous Previous configuration that is updated.
 * @returns {Object}
 */
export const createConfig = (config = {}, previous = {}) => {
  // Merge with defaults.
  const merged = defaultsDeep({ ...defaultConfig }, previous, config);
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

/*
const config = {
  locationCode: '123', // optional, default none
  product: {
    code: '123', // required
    name: 'hello world', // required
    options: [{ // default empty
      name: 'Color',
      value: 'Red',
    }],
    quantity: 2, // optional, defaults 0
    imageUrl: 'foo', // optional
    price: 12.5, // required
    currencyCode: 'EUR', // required
  },
  customer: {
    firstName: '', // optional, defaults to empty,
    lastName: '', // optional, defaults to empty,
    phone: '', // optional, defaults to empty,
    emailAddress: '', // optional, defaults to empty,
  },
  localization: {
    localeCode: 'de-DE', // optional, defaults to browser locale
    de: { // optional, default empty
      'common.ok': 'OKAY',
    },
    en: { // optional, default empty
      'common.ok': 'OK',
    },
  },
  templates: {
    customVariables: {}, // optional, defaults to empty obj
    customTemplates: { // optional, defaults to our templates
      storeSelection: 'a',
      success: 'b',
    },
  },
};
*/

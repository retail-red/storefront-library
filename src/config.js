import handlebars from 'handlebars';
import merge from 'lodash/merge';
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
  unitSystem: 'metric',
  customer: {
    firstName: '',
    lastName: '',
    phone: '',
    emailAddress: '',
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
};

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

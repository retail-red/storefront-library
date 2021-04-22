import merge from 'lodash/merge';
import { getExtraLanguages } from '../internal';
import de from './de';
import en from './en';

function flattenObject(ob) {
  const toReturn = {};

  Object.keys(ob).forEach((i) => {
    if ((typeof ob[i]) === 'object') {
      const flatObject = flattenObject(ob[i]);
      Object.keys(flatObject).forEach((x) => {
        toReturn[`${i}.${x}`] = flatObject[x];
      });
    } else {
      toReturn[i] = ob[i];
    }
  });
  return toReturn;
}
const extraLanguages = getExtraLanguages();
const deFlat = flattenObject({ ...de, ...extraLanguages.de });
const enFlat = flattenObject({ ...en, ...extraLanguages.en });
const defaultTranslations = {
  de: deFlat,
  en: enFlat,
};
let activeTranslations = { ...defaultTranslations };
let activeLanguage = 'en';

/**
 * Updates / Adds custom translations.
 * @param {Object} custom Custom translations
 */
export const updateCustomTranslations = (custom) => {
  activeTranslations = merge({}, defaultTranslations, custom);
};

/**
 * Updates the active language.
 * @param {String} locale Locale string (en, en-US, de, de-DE)
 */
export const updateLanguage = (locale) => {
  // eslint-disable-next-line no-unused-vars
  const [_, language] = locale.toLowerCase().match(/([a-z]{2})(-[a-z]*)?/);
  if (!language || !activeTranslations[language]) {
    return;
  }
  activeLanguage = language;
};

/**
 * Translates the given string.
 * @param {String} key Translation key.
 * @param {Object} parameters Custom template parameters for the translation.
 * @returns {String}
 */
export const t = (key, parameters = {}) => {
  let value = activeTranslations[activeLanguage][key] || key;
  Object.entries(parameters).forEach(([paramName, paramValue]) => {
    value = value.replace(`{{${paramName}}}`, paramValue || '');
  });
  return value;
};

/**
 * Checks if the given translation is available in current language.
 * @param {String} key Translation key.
 * @returns {boolean}
 */
export const hasTranslation = (key) => !!activeTranslations[activeLanguage][key];

/**
 * Returns a list of all available countries and their translated name.
 * @return {Array}
 */
export const getCountries = () => {
  const value = activeTranslations.countries;
  return Object.entries(value).map(([code, name]) => ({ code, name }));
};

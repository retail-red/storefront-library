/* eslint-disable import/prefer-default-export */
/**
 * Returns the browser language
 * @returns {String}
 */
export const getBrowserLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  }
  return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
};

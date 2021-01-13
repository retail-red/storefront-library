/**
 * Transforms the country list into a i18n supported list.
 * @param {Object} countryList Localized country list.
 * @returns {Object}
 */
// eslint-disable-next-line import/prefer-default-export
export const countryListTransform = (countryList) => {
  const { countries } = countryList;
  return Object.assign(
    ...Object.entries(countries)
      .map(([key, value]) => ({
        [key.toLowerCase()]: Array.isArray(value) ? value[0] : value,
      })),
  );
};

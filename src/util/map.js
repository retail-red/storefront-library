/**
 * Creates a direction / navigation link for google maps.
 * @param {Object} address Address store
 * @returns {String}
 */
// eslint-disable-next-line import/prefer-default-export
export const createDirectionsLink = (address) => `https://www.google.com/maps/dir/?api=1&destination=${address.street},${address.city} ${address.postalCode}`;

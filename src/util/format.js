// eslint-disable-next-line import/prefer-default-export
export function formatCurrency(locale, currencyCode, value) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(value);
  } catch (_) {
    return `${value.toFixed(2)} ${currencyCode.toUpperCase()}`;
  }
}

const imageServiceDefaults = {
  format: 'jpeg',
  quality: 85,
  fill: 'ffffff,1',
};

/**
 * Formats a link to our internal image service.
 * @param {string} url Url to an image of the image service.
 * @param {object} options Options attached to the image url.
 * @returns {string} Adjusted service url
 */
export function formatImageServiceUrl(url, options = {}) {
  const params = Object.entries({
    ...imageServiceDefaults,
    ...options,
  }).map(([key, value]) => {
    if (!value) {
      return null;
    }

    return `${key}=${value}`;
  }).filter(Boolean).join('&');

  return `${url}&${params}`;
}

import { t } from '../locales';

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

/**
 * Creates an object with properties for easy rendering of availability information
 * @param {Object} config The Storefront Library config
 * @param {Object} inventory An inventory entity
 * @param {boolean} isLocationSelectMode Whether the display props are created for a store list
 * modal that's opened from the live inventory element where the button just selects a location,
 * but doesn't open the reservation screen.
 * @returns {Object} The generated location display props
 */
export function createLocationDisplayProps(config, inventory, isLocationSelectMode = false) {
  const {
    inventory: {
      hideNumber,
      showExactUntil,
      showLowUntil,
    } = {},
  } = config;

  let status = 'negative';
  let statusText = t('storeList.inventory.unavailable');
  const infoText = '';

  if (inventory) {
    if (!inventory?.isAvailable) {
      // Product is not available
      status = 'negative';
      statusText = t('storeList.inventory.unavailable');
    } else if (hideNumber || inventory?.available === null) {
      // Only show if product is available or not
      status = 'positive';
      statusText = t('storeList.inventory.available');
    } else if (!hideNumber) {
      if (inventory.visible >= showExactUntil) {
        // Rough numbers (10+)
        status = inventory.visible <= showLowUntil ? 'neutral' : 'positive';
        statusText = t('storeList.inventory.rough', { x: showExactUntil });
      } else {
        // Detailed numbers
        status = inventory.visible <= showLowUntil ? 'neutral' : 'positive';
        statusText = t('storeList.inventory.exact', { x: inventory.visible });
      }
    }
  }

  return {
    status,
    statusText,
    infoText,
    buttonDisabled: status === 'negative' && !isLocationSelectMode,
  };
}

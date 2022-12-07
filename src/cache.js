const DEFAULT_CACHE_TIME = 60 * 1000;
export const API_PRODUCT_CACHE_TIME = 1000 * 60 * 5;

export const locationInventoryKey = (locationCode) => `l/${locationCode}/i`;
export const geolocationKey = () => 'geolocation';
export const getAPIProductKey = (configProductCode) => `api_product_${configProductCode}`;

class Cache {
  constructor() {
    this.cacheStorage = {};
  }

  set(key, value, lifetime = DEFAULT_CACHE_TIME) {
    this.cacheStorage[key] = { value, lifetime: Date.now() + lifetime };
  }

  get(key) {
    const cacheEntry = this.cacheStorage[key];
    if (!cacheEntry) {
      return null;
    }

    if (cacheEntry.lifetime < Date.now()) {
      delete this.cacheStorage[key];
      return null;
    }

    return cacheEntry.value;
  }
}

export default new Cache();

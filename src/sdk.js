import { isMobileBrowser, getOS } from './util/browser';

const API_URLS = {
  development: 'https://storefront-api.shopgatedev.io',
  staging: 'https://storefront-api.shopgatepg.io',
  production: 'https://storefront-api.shopgate.io',
};

class RequestError extends Error {
  constructor(status, body = {}) {
    super(`Server request failed with status = ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Wrapper around the Storefront API
 */
class StorefrontAPI {
  constructor(apiKey, stage = 'production') {
    this.apiKey = apiKey;

    // Build base url for all requests.
    const baseUrl = API_URLS[stage];
    if (!baseUrl) {
      // eslint-disable-next-line no-console
      console.error(
        `[SG Enablement] API stage must be one of (${Object.keys(API_URLS).join(', ')}) but was ${stage}`,
      );
      return;
    }
    this.baseUrl = baseUrl;
  }

  /**
   * Triggers a generic request.
   * @param {Object} options Options for request.
   * @param {String} options.method HTTP Method
   * @param {String} options.endpoint API Endpoint
   * @param {String|Object} options.body Request body.
   * @param {Object} options.query URL query parameters.
   * @return {Object}
   */
  async _genericRequest(options) {
    const queryObject = { ...options.query, apiKey: this.apiKey };
    const query = Object
      .entries(queryObject)
      .filter(([, value]) => !!value)
      .map(([key, value]) => `${key}=${encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)}`)
      .join('&');
    const url = `${this.baseUrl}${options.endpoint}?${query}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: options.method || 'GET',
      body: typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body,
    });

    // Response doesn't contain a body.
    if (response.status === 201) {
      return null;
    }

    // Any other unexpected response type.
    if (response.status !== 200) {
      let errorBody = {};
      try {
        const body = await response.json();
        errorBody = body;
      } catch (err) {
        // No need to attach data.
      }

      throw new RequestError(response.status, errorBody);
    }

    return response.json();
  }

  /**
   * Creates multiple orders.
   * @note Platform and OS is automatically enriched to data.
   * @param {Object} orders Storefront Orders.
   * @returns {Object}
   */
  async createOrders(orders) {
    return this._genericRequest({
      endpoint: '/v1/orders',
      method: 'POST',
      body: {
        orders: orders.map((order) => ({
          platform: isMobileBrowser() ? 'mobile' : 'desktop',
          os: getOS(),
          ...order,
        })),
      },
    });
  }

  /**
   * Creates a single order
   * @see StorefrontAPI.createOrders
   * @param {Object} orderData Order data
   * @returns {Object}
   */
  async createOrder(orderData) {
    return this.createOrders([orderData]);
  }

  /**
   * Receives the current inventory for each pair of "product a given location"
   * @param {Array} productLocationCodePairs Code pairs
   * @returns {Object}
   */
  async getInventories(productLocationCodePairs) {
    // Validate
    if (!productLocationCodePairs
      .every(({ productCode, locationCode }) => !!productCode && !!locationCode)
    ) {
      // eslint-disable-next-line no-console
      console.error('[SG Enablement] StorefrontAPI.getInventory pairs must each contain a product code AND a location code');
      return null;
    }

    return this._genericRequest({
      endpoint: '/v1/inventories',
      method: 'POST',
      body: productLocationCodePairs,
    });
  }

  /**
   * Receives a products inventory at one or more locations
   * @param {String} productCode Product code
   * @param {String[]|String} locationCodesOrCode  One or more location codes.
   * @param {String} catalogCode Catalog code.
   * @returns {Object}
   */
  async getProductInventories(productCode, locationCodesOrCode, catalogCode = null) {
    const locationCodes = Array.isArray(locationCodesOrCode)
      ? locationCodesOrCode
      : [locationCodesOrCode];

    let response;

    try {
      response = await this._genericRequest({
        endpoint: `/v1/products/${encodeURIComponent(productCode)}/inventories`,
        query: {
          locationCodes: locationCodes.join(','),
          catalogCode,
          productCode,
        },
      });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
      // Return empty inventory when product is not found in the retail.red system
      response = {
        inventories: locationCodes.map((locationCode) => ({
          locationCode,
          available: 0,
          isAvailable: false,
          visible: 0,
        })),
      };
    }

    return response;
  }

  /**
   * Receives all or locations available for specific product.
   * @param {Object} options Options for the location.
   * @param {Object} options.productCode Allows requesting locations available for a product.
   * @see StoreFront API Document for all options.
   * @returns {Object}
   */
  async getLocations(options = {}) {
    const { productCode, ...query } = options;

    if (productCode) {
      let response;

      try {
        response = await this._genericRequest({
          endpoint: `/v1/products/${encodeURIComponent(productCode)}/locations`,
          query,
        });
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }

        // Request common locations when product is not found in the retail.red system
        const locations = await this.getLocations(query);
        return locations;
      }

      return response;
    }

    return this._genericRequest({
      endpoint: '/v1/locations',
      query,
    });
  }

  /**
   * Receives data of a specific product.
   * @param {String} productCode The target product code.
   * @param {Array} [fields=[]] Data fields that should be fetched.
   * @returns {Object}
   */
  async getProduct(productCode, fields = []) {
    return this._genericRequest({
      endpoint: `/v1/products/${encodeURIComponent(productCode)}`,
      query: {
        fields: fields.join(','),
      },
    });
  }

  /**
   * Validates the given product configuration and returns all further
   * The configuration consists of an array of selected options.

   * Each option looks like `{ code: 'codeOfOption', valueCode: 'codeOfValue' }`
   * available configurations from this point.
   * The configuration consists of an array of selected options.
   * Each option looks like `{ code: 'codeOfOption', valueCode: 'codeOfValue' }`
   * @param {String} productCode
   * @param {Array} selectedOptions
   * @param {String} locationCode
   * @returns {Object}
   */
  async validateProductConfiguration(productCode, selectedOptions, locationCode) {
    return this._genericRequest({
      method: 'POST',
      endpoint: `/v1/products/${encodeURIComponent(productCode)}/validate`,
      ...(locationCode ? { query: { locationCode } } : {}),
      body: {
        selectedOptions,
      },
    });
  }
}

export default StorefrontAPI;

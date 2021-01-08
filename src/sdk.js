class StorefrontAPI {
  constructor(apiKey) {}

  async createOrder(orderData) {}

  async getProductInventory(productCode, locationCodes, catalogCode = null) {}

  async getProductsInventory(productLocationCodePairs) {}

  async getLocations(options) {}
}

export default StorefrontAPI;

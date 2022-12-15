import Controller from './controller';
import Cache, {
  locationInventoryKey,
  geolocationKey,
  getAPIProductKey,
  API_PRODUCT_CACHE_TIME,
} from '../cache';
import { t } from '../locales';
import { getImmediateGeolocation } from '../util/geolocation';
import { formatImageServiceUrl, createLocationDisplayProps } from '../util/format';
import { validateConfigForProduct } from '../config';

class StoreListController extends Controller {
  constructor(routeName, templateName, app, config, sdk) {
    super(routeName, templateName, app, config, sdk, 'rr-modal-inner');
    this.state.postalCode = null;
  }

  getTitle() {
    return t('storeList.title');
  }

  async load({ locationCode = null, options = {}, select = false }) {
    // Product data.
    const {
      inventory,
      useGeolocationImmediately,
      useApiProduct,
    } = this.config;

    let { product } = this.config ?? {};
    let parentProduct;

    if (useApiProduct && product?.code) {
      // Fetch product(s) from Storefront API when configured
      ({ parentProduct, product } = await this._receiveProductInitial(product.code));
    }

    // Countries
    const countries = this.config.localization.countries.map((code) => ({
      code,
      name: t(`countries.${code}`),
    }));
    this.countryCode = countries[0].code;

    // Get geolocation immediately
    if (useGeolocationImmediately && !locationCode && !options.postalCode) {
      const cachedCoords = Cache.get(geolocationKey);

      if (cachedCoords) {
        this.geolocation = cachedCoords;
      } else {
        try {
          const { coords } = await getImmediateGeolocation();
          this.geolocation = coords;
          Cache.set(geolocationKey, coords);
        } catch (err) {
          // Error can be ignored / user probably just rejected geolocation permission.
        }
      }
    }

    // Prefill search
    if (options.postalCode) {
      this.state.postalCode = options.postalCode;
    }

    // Receive all locations for initial loading.
    const locations = await this._receiveLocations(
      useApiProduct ? product : null,
      parentProduct,
      select,
    );

    // Initiate reservation at given location.
    const location = locations.find((l) => l.code === locationCode);

    if (location && !select && !useApiProduct) {
      requestAnimationFrame(() => {
        this.selectLocation(locationCode, true);
      });
    }

    return {
      skipRendering: !!location && !select && !useApiProduct,
      select,
      parentProduct,
      product,
      locations,
      countries,
      inventoryConfig: inventory,
      isApiProduct: useApiProduct,
    };
  }

  /**
   * Fetches the initial product(s) for the first render
   * @param {string} configProductCode Product code from the config
   * @returns {Object}
   */
  async _receiveProductInitial(configProductCode) {
    const cachedProducts = Cache.get(getAPIProductKey(configProductCode));

    if (cachedProducts) {
      return cachedProducts;
    }

    // Fetch the product that's configured within the config
    let product = await this._receiveProduct(configProductCode);

    let parentProduct = product;

    if (product?.parentProductCode) {
      // Request the parent product when product in config is a child product
      parentProduct = await this._receiveProduct(product.parentProductCode);
      // Since the initial product is a child product with options, the base product options
      // need preparation so that the UI renders correctly.
      ({ parentProduct, product } = this._sanitizeOrderableProduct(product, parentProduct));
    } else if (product?.modelType === 'configurable') {
      let selection = [];

      // Check if the product just has a single child product
      const hasSingleChildProduct = product.options.every((option) => option.values.length === 1);

      if (hasSingleChildProduct) {
        // Simulate selection of the child product for validation request
        selection = product.options.map((option) => ({
          code: option.code,
          valueCode: option.values[0].code,
        }));
      }

      // Fetched product is a parent product, so we need to validate the option selection
      // to figure out which options can be selected
      const validation = await this.sdk.validateProductConfiguration(
        product.code,
        selection,
      );

      if (validation?.possibleOptions) {
        ({ parentProduct } = this._sanitizeProductDataForIncompleteOptionSelection(
          parentProduct,
        ));
      } else if (validation?.matchingVariant?.productCode) {
        // Retrieved product code of the one and only child product
        product = await this._receiveProduct(validation.matchingVariant.productCode);
        // Prepare data for the UI
        ({ parentProduct, product } = this._sanitizeOrderableProduct(product, parentProduct));
      }
    } else if (product?.modelType === 'standard') {
      ({ parentProduct, product } = this._sanitizeOrderableProduct(product));
    }

    // Put product data to the cache, for easy re-hydration of the modal after re-opening when
    // users already selected option values before closing.
    Cache.set(getAPIProductKey(configProductCode), {
      parentProduct,
      product,
    }, API_PRODUCT_CACHE_TIME);

    return {
      parentProduct,
      product,
    };
  }

  /**
   * Fetches a product via the storefront API
   * @param {string} productCode
   * @returns {Object}
   */
  async _receiveProduct(productCode) {
    try {
      // Fetch the product
      const product = await this.sdk.getProduct(productCode, [
        'code',
        'parentProductCode',
        'name',
        'price',
        'currencyCode',
        'options',
        'media',
        'properties',
        'modelType',
        'identifiers',
      ]);

      // Add quantity from config and complete the product image url
      const extended = {
        quantity: this.config?.product?.quantity ?? 1,
        ...product,
        imageUrl: product?.media[0]?.url
          ? formatImageServiceUrl(product?.media[0]?.url, { width: 400, height: 400 })
          : '',
      };

      delete extended.media;

      return extended;
    } catch (e) {
      // Nothing to do here
    }

    return undefined;
  }

  /**
   * Fetch locations for the current situation and enriches location data with inventory if possible
   * @param {Object} [apiProduct=null] Optional API product entity when product data is fetched via
   * the Storefront API
   * @param {Object} [apiParentProduct=null] Optional API parent product entity when product data
   * is fetched via the Storefront API and the product from the config is a "configurable" product.
   * @param {boolean} [select=null] Whether the store list was opened from the live inventory
   * element and the location button just selects a location, but doesn't open the reservation form.
   * @returns {Array} Fetched locations
   */
  async _receiveLocations(apiProduct = null, apiParentProduct = null, select = null) {
    let isLocationSelectMode = select;

    if (isLocationSelectMode === null) {
      isLocationSelectMode = this.state.select;
    }

    const { unitSystem, useApiProduct, hooks: { afterCreateStoreListLocations } } = this.config;
    let { product } = this.config;

    this.app.setLoading(true);

    let isValidProduct = validateConfigForProduct(this.config);

    if (useApiProduct && isValidProduct) {
      product = apiProduct;
      // API products are invalid when they are "parent" products
      isValidProduct = apiProduct && apiProduct?.modelType !== 'configurable';
    }

    try {
      // Fetch location data
      const { locations } = await this.sdk.getLocations({
        productCode: product ? product.code : undefined,
        postalCode: this.state.postalCode,
        countryCode: this.countryCode,
        ...(this.state.postalCode || this.geolocation ? ({
          unitSystem,
        }) : {}),
        ...(this.geolocation ? ({
          longitude: this.geolocation.longitude,
          latitude: this.geolocation.latitude,
        }) : {}),
      });

      let inventories = [];

      if (isValidProduct && locations.length) {
        // Fetch inventory data.
        ({ inventories } = await this.sdk.getProductInventories(
          product.code,
          locations.map((l) => l.code),
        ));
      }

      // Aggregate inventory data onto location
      let aggregatedLocations = locations
        .map((location) => {
          const inventory = inventories.find((i) => i.locationCode === location.code);

          return {
            ...location,
            primaryAddress: location.addresses.find((a) => a.isPrimary) || location.addresses[0],
            inventory,
            displayProps: createLocationDisplayProps(this.config, inventory, isLocationSelectMode),
            operationHours: Object
              .entries(location.operationHours || {})
              .filter(([, v]) => !!v)
              .length
              ? location.operationHours : null,
          };
        })
        .filter((l) => (isValidProduct ? !!l.inventory : true));

      try {
        const hookResult = await afterCreateStoreListLocations(
          aggregatedLocations,
          product,
          {
            sdk: this.sdk,
            t,
            ...(apiParentProduct ? { parentProduct: apiParentProduct } : null),
          },
        );

        if (Array.isArray(hookResult)) {
          aggregatedLocations = hookResult;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      if (aggregatedLocations.length !== 0) {
        this.state.emptyList = false;
      }
      this.app.setLoading(false);
      return aggregatedLocations;
    } catch (err) {
      this.state.emptyList = true;
      this.app.setLoading(false);
      return [];
    }
  }

  async _updateStoreList() {
    const { useApiProduct } = this.config;
    const product = this.state?.product ?? null;
    const parentProduct = this.state?.parentProduct ?? null;

    this.state.locations = await this._receiveLocations(
      useApiProduct ? product : null,
      parentProduct,
    );
    this.partialRender('.rr-list');
  }

  setPostalCode(code) {
    this.geolocation = null;
    this.state.postalCode = code;
    this._updateStoreList();
  }

  setCountryCode(code) {
    this.countryCode = code;
  }

  setGeolocation() {
    if (!navigator.geolocation) {
      return;
    }
    this.app.setLoading(true);
    // Ask for the current location and update store list.
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.state.postalCode = null;
      this.geolocation = coords;
      this.app.setLoading(false);
      Cache.set(geolocationKey(), coords);
      this._updateStoreList();
    });
  }

  selectLocation(locationCode, silent = false) {
    // Find location data and emit public event.
    const location = this.state.locations.find((l) => l.code === locationCode);
    if (silent) {
      this.app.publicInterface._triggerEvent('locationChanged', { location });
    }

    // In selection mode we simply update the current config.
    Cache.set(locationInventoryKey(locationCode), location);
    if (this.state.select) {
      this.app.publicInterface.updateConfig({ locationCode });
      this.app.destroy();
      return;
    }

    // Navigate to reservation form.
    this.app.pushRoute('reserve', {
      product: this.state.product,
      location,
    });
  }

  /**
   * Prepares child product data to be displayed on the UI.
   * @param {Object} product The product that belongs to the selected set of options
   * @param {Object} [parentProduct=null] The parent product for the child products
   * @returns {Object}
   */
  _sanitizeOrderableProduct(product, parentProduct = null) {
    // Transform API products to fit specifications for the configuration object
    const finalProduct = {
      ...product,
      price: product.price?.salePrice || product.price?.price,
      currencyCode: product.price.currencyCode,
    };

    if (parentProduct === null) {
      // No further actions needed when product is a "standard" one
      return {
        product: finalProduct,
      };
    }

    // Convert product options to a better processable structure
    const productOptions = (product.options ?? []).map((option) => ({
      code: option?.code,
      name: option?.name,
      value: {
        code: option?.values?.[0]?.code,
        name: option?.values?.[0]?.name,
      },
    }));

    // Inject a "selected" property to the base product option values
    const parentProductOptions = (parentProduct.options ?? []).map((option) => {
      // Detect options for the product and map them to the "selected" state of the
      // corresponding options of the base product
      const values = option.values.map((value) => ({
        ...value,
        selected: !!productOptions.find((productOption) => (
          productOption.code === option.code
            && productOption.value.code === value.code
        )),
      }));

      return {
        ...option,
        values,
        selectedCode: values.find(({ selected }) => !!selected)?.code ?? null,
      };
    });

    return {
      product: {
        ...finalProduct,
        // Product image fallback to parent product image when child has no image
        imageUrl: finalProduct?.imageUrl || parentProduct.imageUrl,
        options: productOptions,
      },
      parentProduct: {
        ...parentProduct,
        options: parentProductOptions,
      },
    };
  }

  /**
   * Prepares a parent product entity to be used as base for the options selection UI. It
   * adds some extra data to the options array for easy processing within the handlebars template.
   * @param {Object} parentProduct Parent product entity
   * @param {Array} selection Current option selection
   * @returns
   */
  _sanitizeProductDataForIncompleteOptionSelection(
    parentProduct,
    selection = [],
  ) {
    const parentProductOptions = (parentProduct.options ?? []).map((option) => {
      const values = option.values.map((value) => {
        // Flag selected options within the parent product options array
        const selected = selection.find((selectionOption) => (
          selectionOption.code === option.code
                && selectionOption.valueCode === value.code
        ));

        return {
          ...value,
          selected,
        };
      });

      return ({
        ...option,
        values,
        // Inject "selectedCode" property to avoid lookup logic within handlebars template
        selectedCode: values.find(({ selected }) => !!selected)?.code ?? null,
      });
    });

    return {
      parentProduct: {
        ...parentProduct,
        options: parentProductOptions,
      },
    };
  }

  /**
   * Called whenever option selection changes
   * @param {Array} optionSelection Currently selected options
   */
  async updateOptionSelection(optionSelection) {
    try {
      const productCode = this.state?.parentProduct?.code;
      let product;
      let parentProduct;

      // Validate the product selection
      const validation = await this.sdk.validateProductConfiguration(
        productCode,
        optionSelection,
      );

      if (validation?.matchingVariant?.productCode) {
        // Fetch product when selection matches a product
        const matchingVariant = await this._receiveProduct(
          validation?.matchingVariant?.productCode,
        );

        // Sanitize product entity for the Storefront Library
        ({ product, parentProduct } = this._sanitizeOrderableProduct(
          matchingVariant,
          this.state.parentProduct,
        ));

        // Update state with product and location data
        this.setState({
          parentProduct,
          product,
          locations: await this._receiveLocations(product, parentProduct),
        });
      } else if (Array.isArray(validation?.possibleOptions)) {
        ({ parentProduct } = this._sanitizeProductDataForIncompleteOptionSelection(
          this.state.parentProduct,
          optionSelection,
        ));

        // Current product selection does not match a productCode yet. Update state with sanitized
        // product and location data.
        this.setState({
          parentProduct,
          locations: await this._receiveLocations(parentProduct, parentProduct),
        });
      }

      const { product: { code } } = this.config;

      // Update the products within the cache
      Cache.set(getAPIProductKey(code), {
        parentProduct,
        product: product ?? this.state.product,
      }, API_PRODUCT_CACHE_TIME);
    } catch (e) {
      // Nothing to do here
    }
  }
}

StoreListController.templateName = 'storeList';
StoreListController.routeName = 'storeList';

export default StoreListController;

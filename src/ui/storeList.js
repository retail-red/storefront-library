import Controller from './controller';
import Cache, { locationInventoryKey } from '../cache';
import { t } from '../locales';
import { getImmediateGeolocation } from '../util/geolocation';

class StoreListController extends Controller {
  constructor(...params) {
    super(...params);
    this.state.postalCode = null;
  }

  getTitle() {
    return t('storeList.title');
  }

  async load({ locationCode = null, options = {}, select = false }) {
    // Product data.
    const { product, inventory, useGeolocationImmediately } = this.config;

    // Countries
    const countries = this.config.localization.countries.map((code) => ({
      code,
      name: t(`countries.${code}`),
    }));
    this.countryCode = countries[0].code;

    // Get geolocation immediately
    if (useGeolocationImmediately && !locationCode && !options.postalCode) {
      try {
        const { coords } = await getImmediateGeolocation(({ coords: innerCoords }) => {
          this.state.postalCode = null;
          this.geolocation = innerCoords;
          this._updateStoreList();
        });
        this.geolocation = coords;
      } catch (err) {
        // Error can be ignored / user probably just rejected geolocation permission.
      }
    }

    // Prefill search
    if (options.postalCode) {
      this.state.postalCode = options.postalCode;
    }

    // Receive all locations for initial loading.
    const locations = await this._receiveLocations();

    // Initiate reservation at given location.
    const location = locations.find((l) => l.code === locationCode);
    if (location && !select) {
      requestAnimationFrame(() => {
        this.selectLocation(locationCode, true);
      });
    }

    return {
      skipRendering: !!location && !select,
      select,
      product,
      locations,
      countries,
      inventoryConfig: inventory,
    };
  }

  async _receiveLocations() {
    const { unitSystem } = this.config;

    this.app.setLoading(true);
    try {
      // Fetch location data
      const { locations } = await this.sdk.getLocations({
        productCode: this.config.product.code,
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

      // Fetch inventory data.
      const { inventories } = await this.sdk.getProductInventories(
        this.config.product.code,
        locations.map((l) => l.code),
      );

      // Aggregate inventory data onto location
      const aggregatedLocations = locations
        .map((location) => ({
          ...location,
          primaryAddress: location.addresses.find((a) => a.isPrimary) || location.addresses[0],
          inventory: inventories.find((i) => i.locationCode === location.code),
          operationHours: Object
            .entries(location.operationHours || {})
            .filter(([, v]) => !!v)
            .length
            ? location.operationHours : null,
        }))
        .filter((l) => !!l.inventory);

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
    this.state.locations = await this._receiveLocations();
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

    // Ask for the current location and update store list.
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.state.postalCode = null;
      this.geolocation = coords;
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
    if (this.state.select) {
      Cache.set(locationInventoryKey(locationCode), location);
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
}

StoreListController.templateName = 'storeList';
StoreListController.routeName = 'storeList';

export default StoreListController;

import Controller from './controller';
import { t } from '../locales';

class StoreListController extends Controller {
  constructor(...params) {
    super(...params);
    this.postalCode = null;
    [this.countryCode] = this.config.localization.countries;
  }

  getTitle() {
    return t('storeList.title');
  }

  async load({ locationCode = null }) {
    // Product data.
    const { product, inventory } = this.config;

    // Countries
    const countries = this.config.localization.countries.map((code) => ({
      code,
      name: t(`countries.${code}`),
    }));
    this.countryCode = countries[0].code;

    // Receive all locations for initial loading.
    const locations = await this._receiveLocations();

    // Initiate reservation at given location.
    const location = locations.find((l) => l.code === locationCode);
    if (location) {
      requestAnimationFrame(() => {
        this.initiateReservation(locationCode);
      });
    }

    return {
      skipRendering: !!location,
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
        postalCode: this.postalCode,
        countryCode: this.countryCode,
        ...(this.postalCode || this.geolocation ? ({
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
    this.postalCode = code;
    this._updateStoreList();
  }

  setCountryCode(code) {
    this.countryCode = code;
  }

  setGeolocation() {
    if (!navigator.geolocation) {
      return;
    }

    // Reset existing filters.
    this.postalCode = null;

    // Ask for the current location and update store list.
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.geolocation = coords;
      this._updateStoreList();
    });
  }

  initiateReservation(locationCode) {
    const location = this.state.locations.find((l) => l.code === locationCode);
    this.app.pushRoute('reserve', {
      product: this.state.product,
      location,
    });
  }
}

StoreListController.templateName = 'storeList';
StoreListController.routeName = 'storeList';

export default StoreListController;

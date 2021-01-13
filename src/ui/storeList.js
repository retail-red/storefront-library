import Controller from './controller';
import { t } from '../locales';

class StoreListController extends Controller {
  constructor(...params) {
    super(...params);
    this.postalCode = null;
    this.countryCode = 'de';
  }

  getTitle() {
    return t('storeList.title');
  }

  async load() {
    // Product data.
    const { product } = this.config;

    // Countries
    const countries = this.config.localization.countries.map((code) => ({
      code,
      name: t(`countries.${code}`),
    }));
    this.countryCode = countries[0].code;

    // Receive all locations for initial loading.
    const locations = await this._receiveLocations();

    return {
      product,
      locations,
      countries,
    };
  }

  async _receiveLocations() {
    try {
      const { locations } = await this.sdk.getLocations({
        postalCode: this.postalCode,
        countryCode: this.countryCode,
        ...(this.geolocation ? ({
          longitude: this.geolocation.longitude,
          latitude: this.geolocation.latitude,
        }) : {}),
      });
      this.state.emptyList = false;
      return locations;
    } catch (err) {
      this.state.emptyList = true;
      return [];
    }
  }

  async _updateStoreList() {
    this.state.locations = await this._receiveLocations();
    this.partialRender('.sg-list');
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
}

StoreListController.templateName = 'storeList';
StoreListController.routeName = 'storeList';

export default StoreListController;

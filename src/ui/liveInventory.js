import Controller from './controller';
import Cache, { locationInventoryKey } from '../cache';

class LiveInventoryController extends Controller {
  /**
   * Updates the location in the state.
   * @param {String} locationCode The location code
   */
  _updateLocation(locationCode) {
    const cachedLocation = Cache.get(locationInventoryKey(locationCode));
    this.setState({
      locationCode,
      location: cachedLocation,
      ...(cachedLocation
        ? ({ inventory: cachedLocation.inventory })
        : ({})),
    });
    this._loadLocationData(locationCode);
  }

  /**
   * Loads location data of a specific location into the state.
   * @param {String} locationCode The location code
   */
  async _loadLocationData(locationCode) {
    const { code: productCode } = this.config.product;
    try {
      const { locations } = await this.sdk.getLocations({ codes: locationCode });
      if (!locations[0]) {
        throw new Error();
      }
      const { inventories } = await this.sdk.getProductInventories(productCode, locationCode);
      this.setState({ location: locations[0], inventory: inventories[0] });
    } catch (err) {
      this.setState({ locationCode: null, location: null });
    }
  }

  /**
   * Loads all available locations into state.
   */
  async _loadLocations() {
    const { code: productCode } = this.config.product;
    const { locations } = await this.sdk.getLocations({});
    const { inventories } = await this.sdk.getProductInventories(
      productCode,
      locations.map((l) => l.code),
    );
    this.setState({
      locations: locations
        .map((l) => ({
          ...l,
          inventory: inventories.find((i) => i.locationCode === l.code),
        })),
    });
  }

  async load({ variant }) {
    const { locationCode, inventory } = this.config;
    if (locationCode) {
      this._loadLocationData(locationCode);
    }

    if (variant === 'list') {
      this._loadLocations();
    }

    return {
      variant,
      locationCode,
      inventoryConfig: inventory,
    };
  }

  /**
   * Listens for config changes to sync state with default location.
   * @param {Object} config Config
   * @param {Object} updated Updated
   */
  updateConfig(config, updated) {
    super.updateConfig(config, updated);

    // React to location code changes
    const { locationCode, product } = updated;
    if (locationCode) {
      this._updateLocation(locationCode);
    }

    // React to product changes.
    if (product && product.code) {
      this.setState({ location: null, inventory: null });
      requestAnimationFrame(() => {
        this._loadLocationData(config.locationCode);
      });
    }
  }

  /**
   * Triggers the search modal to select a location.
   * @param {Object} options Search options.
   */
  search(options) {
    if (this.state.variant === 'list') {
      this.setState({ selection: true });
      return;
    }

    const modalPlaceholder = this.app.publicInterface.Class._globalModalPlaceholderSingleton();
    this.app.start(modalPlaceholder, { options, select: true });
  }

  /**
   * Initiates the reservation process for current location.
   */
  reserve() {
    if (!this.state.inventory.isAvailable && this.state.variant === 'list') {
      this.setState({ selection: true });
      return;
    }

    const modalPlaceholder = this.app.publicInterface.Class._globalModalPlaceholderSingleton();
    if (!this.state.inventory.isAvailable) {
      this.app.start(modalPlaceholder, { locationCode: null });
      return;
    }

    this.app.start(modalPlaceholder);
  }

  /**
   * Cancels the active change process.
   */
  cancelSelection() {
    this.setState({ selection: false });
  }

  /**
   * Updates the current location code.
   */
  setLocation(locationCode) {
    this.state.selection = false;
    const location = this.state.locations.find((l) => l.code === locationCode);
    Cache.set(locationInventoryKey(locationCode), location);
    this.app.publicInterface._triggerEvent('locationChanged', { location });
    this.app.publicInterface.updateConfig({ locationCode });
  }
}

LiveInventoryController.templateName = 'liveInventory';
LiveInventoryController.routeName = 'liveInventory';

export default LiveInventoryController;

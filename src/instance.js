import { createConfig, validateConfigForRendering } from './config';
import { updateCustomTranslations, updateLanguage } from './locales';
import StoreListController from './ui/storeList';
import ReserveController from './ui/reserve';
import LiveInventoryController from './ui/liveInventory';
import SuccessController from './ui/success';
import App from './ui/app';
import reserveButtonTemplate from './templates/reserveButton.hbs';
import Sdk from './sdk';

class Instance {
  /**
   * Initializes the instance.
   * @param {Object} config Config
   */
  constructor(config) {
    this.eventListeners = {};
    this.config = createConfig(config);
    this.sdk = new Sdk(config.apiKey, config.apiStage);
    this.Class = Instance;
    this._handleConfigUpdate();
  }

  static _globalModalPlaceholderSingleton() {
    if (Instance._modalPlaceholder) {
      return Instance._modalPlaceholder;
    }
    const div = document.createElement('div');
    div.id = 'rr-omni-modal-placeholder';
    div.innerHTML = '';
    document.body.appendChild(div);
    Instance._modalPlaceholder = div;
    return div;
  }

  _handleConfigUpdate() {
    // Update i18n
    const { localeCode, countries, ...languages } = this.config.localization;
    updateLanguage(localeCode);
    updateCustomTranslations(languages);
  }

  _createApp() {
    this.app = new App(this.config, this.sdk, this);
    this.app.addController(StoreListController);
    this.app.addController(ReserveController);
    this.app.addController(SuccessController);
    this.app.addController(LiveInventoryController);
  }

  _triggerEvent(eventName, payload) {
    const listeners = this.eventListeners[eventName] || [];
    listeners.forEach((listener) => listener(payload));
  }

  /**
   * Updates the current config with the given keys.
   * Does a partial update if not all keys are provided.
   * @param {Object} config Config
   */
  updateConfig(config) {
    this.config = createConfig(config, this.config);
    if (this.app) {
      this.app.updateConfig(this.config, config);
    }
    this._handleConfigUpdate();
  }

  /**
   * Renders and injects the quick reserve button.
   * @param {String|HTMLElement} target The target element or container
   */
  renderReserveButton(target) {
    // Validate config
    if (!validateConfigForRendering(this.config)) {
      return;
    }

    // Target can be either a string or element.
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    // Initialize application.
    this._createApp();

    // Render button
    const customTemplate = this.config.templates.customTemplates.reserveButton;
    targetElement.innerHTML = customTemplate ? customTemplate() : reserveButtonTemplate();
    const button = targetElement.querySelector('#rr-omni-reserve-button');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const modalPlaceholder = Instance._globalModalPlaceholderSingleton();
      this.app.start(modalPlaceholder);
    });
  }

  /**
   * Renders and injects the live inventory.
   * @param {String|HTMLElement} target The target element or container.
   * @param {Object} options Options.
   */
  renderLiveInventory(target, options = { variant: 'modal' }) {
    // Validate config
    if (!validateConfigForRendering(this.config)) {
      return;
    }

    // Target can be either a string or element.
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    // Initialize application.
    this._createApp();

    // Render content.
    this.app.renderInline(targetElement, 'liveInventory', options);
  }

  /**
   * Manually opens the reservation modal with active configs.
   */
  openReservationModal() {
    // Validate config
    if (!validateConfigForRendering(this.config)) {
      return;
    }

    // Initialize application.
    this._createApp();

    // Render modal
    const modalPlaceholder = Instance._globalModalPlaceholderSingleton();
    this.app.start(modalPlaceholder);
  }

  /**
   * Adds a new event listener for a specific event.
   * @param {String} eventName Name of the event.
   * @param {function} callback Callback that will be triggered upon event.
   * @returns {function} Event listener remover
   */
  addEventListener(eventName, callback) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(callback);

    return () => {
      this.eventListeners[eventName].splice(this.eventListeners[eventName].indexOf(callback), 1);
    };
  }
}

export default Instance;

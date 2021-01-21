import { createConfig, validateConfigForRendering } from './config';
import { updateCustomTranslations, updateLanguage } from './locales';
import StoreListController from './ui/storeList';
import ReserveController from './ui/reserve';
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
    this.config = createConfig(config);
    this.sdk = new Sdk(config.apiKey, config.apiStage);
    this._handleConfigUpdate();
  }

  _handleConfigUpdate() {
    // Update i18n
    const { localeCode, countries, ...languages } = this.config.localization;
    updateLanguage(localeCode);
    updateCustomTranslations(languages);
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

  _createApp() {
    this.app = new App(this.config, this.sdk);
    this.app.addController(StoreListController);
    this.app.addController(ReserveController);
    this.app.addController(SuccessController);
  }

  /**
   * Updates the current config with the given keys.
   * Does a partial update if not all keys are provided.
   * @param {Object} config Config
   */
  updateConfig(config) {
    if (this.app) {
      this.app.updateConfig(config);
    }
    this.config = createConfig(config, this.config);
    this._handleConfigUpdate();
  }

  /**
   * Renders the document
   * @param {String|HTMLElement} target The target element or container for the button
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
}

export default Instance;

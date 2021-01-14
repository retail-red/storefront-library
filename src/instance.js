import { createConfig, validateConfigForRendering } from './config';
import { updateCustomTranslations, updateLanguage } from './locales';
import StoreListController from './ui/storeList';
import ReserveController from './ui/reserve';
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
    const { localeCode, ...languages } = this.config.localization;
    updateLanguage(localeCode);
    updateCustomTranslations(languages);
  }

  static _globalModalPlaceholderSingleton() {
    if (Instance._modalPlaceholder) {
      return Instance._modalPlaceholder;
    }
    const div = document.createElement('div');
    div.id = 'sg-omni-modal-placeholder';
    div.innerHTML = '';
    document.body.appendChild(div);
    Instance._modalPlaceholder = div;
    return div;
  }

  /**
   * Updates the current config with the given keys.
   * Does a partial update if not all keys are provided.
   * @param {Object} config Config
   */
  updateConfig(config) {
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
    const app = new App(this.config, this.sdk);
    app.addController(StoreListController);
    app.addController(ReserveController);

    // Render button
    targetElement.innerHTML = reserveButtonTemplate();
    const button = targetElement.querySelector('#sg-omni-reserve-button');
    button.addEventListener('click', () => {
      const modalPlaceholder = Instance._globalModalPlaceholderSingleton();
      app.start(modalPlaceholder);
    });
  }
}

export default Instance;

import { createConfig, validateConfigForRendering } from './config';
import { updateCustomTranslations, updateLanguage } from './locales';

class Instance {
  /**
   * Initializes the instance.
   * @param {Object} config Config
   */
  constructor(config) {
    this.config = createConfig(config);
    this._handleConfigUpdate();
  }

  _handleConfigUpdate() {
    // Update i18n
    const { localeCode, ...languages } = this.config.localization.localeCode;
    updateLanguage(localeCode);
    updateCustomTranslations(languages);
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
  }
}

export default Instance;

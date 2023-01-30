import debounce from 'lodash/debounce';
import defaultTemplates from '../templates/defaults';

/**
 * Clones a script tag and therefore triggers re-execution.
 * @param {HTMLElement} node Target node.
 * @param {function} callback Load callback
 */
const executeScript = (node) => {
  const script = document.createElement('script');
  script.text = node.innerHTML;

  let i = -1; const attrs = node.attributes;
  let attr;
  // eslint-disable-next-line no-plusplus
  while (++i < attrs.length) {
    script.setAttribute((attr = attrs[i]).name, attr.value);
  }
  node.parentNode.replaceChild(script, node);
};

class Controller {
  constructor(routeName, templateName, app, config, sdk, targetClassName) {
    this.routeName = routeName;
    this.templateName = templateName;
    this.targetClassName = targetClassName;
    this.app = app;
    this.config = config;
    this.sdk = sdk;
    this.state = {};
    // Load template
    this.template = this.config.templates.customTemplates[templateName]
      || defaultTemplates[templateName];
    this.renderDebounced = debounce(() => this.render(this.previousTarget), 200);
  }

  // eslint-disable-next-line no-empty-function
  async load() {}

  getTitle() {
    return '';
  }

  /**
   * Updates the configuration that the controller is storing.
   * @param {Object} config New configuration
   */
  updateConfig(config) {
    this.config = config;
  }

  /**
   * Updates template state and triggers a re-render
   * @param {Object} state State
   */
  setState(state) {
    this.state = { ...this.state, ...state };
    this.renderDebounced();
  }

  domUpdated() {}

  /**
   * Updates a custom css property that contains the current height of the header element.
   * This is necessary, since inside the .rr-modal-container class the height property is calculated
   * by subtract the header height from 100%. Since headers have different heights based on their
   * content, this value needs to be determined whenever the view inside the modal changes.
   */
  updateHeaderHeightCustomProperty() {
    // Name of the custom property for the header height
    const key = '--rr-modal-header-height';
    // Select header and modal elements
    const headerEl = document.querySelector('.rr-modal-header');
    const modalEl = document.getElementById('rr-omni');

    // Only proceed when both elements are available
    if (!headerEl || !modalEl) {
      return;
    }

    // Get the height of the modal header
    const headerHeight = headerEl.offsetHeight;

    const { style } = modalEl;
    if (style.getPropertyValue(key) !== headerHeight) {
      // Apply the value to the custom property at the modal element
      style.setProperty(key, headerHeight);
    }
  }

  /**
   * Re-renders the template but only updates the DOM partially.
   * @param {String} targetSelector Selector for part that should be re-rendered.
   */
  partialRender(targetSelector) {
    // Render into shadow node.
    const target = document.createElement('div');
    this.render(target, true);

    // Find new list and replace the old.
    const newNode = target.querySelector(targetSelector);
    const oldNode = this.previousTarget.querySelector(targetSelector);
    oldNode.parentNode.replaceChild(newNode, oldNode);
  }

  /**
   * Renders the template.
   * @param {HTMLElement} target Target parent node.
   * @param {boolean} silent A silent update triggers no scripts or updates any state.
   */
  render(target, silent = false) {
    // Save target for later re-rendering.
    if (!silent) {
      this.previousTarget = target;
    }

    // Render template and replace DOM content.
    const templateVariables = {
      ...this.config.templates.customVariables,
      ...this.state,
    };
    const html = this.template(templateVariables);

    /* eslint-disable no-param-reassign */
    target.innerHTML = '';
    const newContent = document.createElement('div');

    if (this.targetClassName) {
      newContent.className = this.targetClassName;
    }

    newContent.innerHTML = html;
    target.appendChild(newContent);
    /* eslint-enable no-param-reassign */

    // Evaluates all script tags within template.
    if (!silent) {
      [...target.querySelectorAll('script')].forEach(executeScript);
      window.__RrOmniCallbacks.forEach((cb) => cb(this));
      window.__RrOmniCallbacks = [];
    }
    requestAnimationFrame(() => {
      this.domUpdated(target, silent);
      this.updateHeaderHeightCustomProperty();
    });
  }
}

export default Controller;

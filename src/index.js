import handlebars from 'handlebars';
import Instance from './instance';
import Sdk from './sdk';

import './styles/base.scss';
import './hbsRuntime';

window.__SgOmniCallbacks = [];

export const OmniSdk = Sdk;
export const OmniEnablement = {
  /**
   * Creates a new enablement instance
   * @param {Object} config  Configuration
   * @returns {Instance}
   */
  create(config) { return new Instance(config); },
  /**
   * Registers a callback that will be executed after template rendering.
   * @param {function} callback Callback
   */
  onLoad(callback) { window.__SgOmniCallbacks.push(callback); },
  /**
   * Registers a new / overrides a helper that can be used within all templates.
   * @param {String} name Name that will be used in the template.
   * @param {function} helper Helper
   */
  registerTemplateHelper(name, helper) { handlebars.registerHelper(name, helper); },
};

window.SgOmniClientSdk = OmniSdk;
window.SgOmniEnablement = OmniEnablement;

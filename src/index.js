import Instance from './instance';
import Sdk from './sdk';

import './styles/base.scss';
import './hbsRuntime';

window.__SgOmniCallbacks = [];

export const OmniSdk = Sdk;
export const OmniEnablement = {
  create(config) { return new Instance(config); },
  onLoad(callback) { window.__SgOmniCallbacks.push(callback); },
};

window.SgOmniClientSdk = OmniSdk;
window.SgOmniEnablement = OmniEnablement;

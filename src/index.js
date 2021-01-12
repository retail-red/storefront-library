import Instance from './instance';
import Sdk from './sdk';

import './styles/base.scss';

export const OmniSdk = Sdk;
export const OmniEnablement = {
  create(config) { return new Instance(config); },
};

window.SgOmniClientSdk = OmniSdk;
window.SgOmniEnablement = OmniEnablement;

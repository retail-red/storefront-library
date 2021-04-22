import { getExtraTemplates } from '../internal';

import storeList from './storeList.hbs';
import reserve from './reserve.hbs';
import success from './success.hbs';
import liveInventory from './liveInventory.hbs';

export default {
  storeList,
  reserve,
  success,
  liveInventory,
  ...getExtraTemplates(),
};

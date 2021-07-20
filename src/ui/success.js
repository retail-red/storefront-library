import Controller from './controller';
import { t } from '../locales';

class SuccessController extends Controller {
  constructor(routeName, templateName, app, config, sdk) {
    super(routeName, templateName, app, config, sdk, 'rr-modal-inner');
  }

  getTitle() {
    return t('success.title');
  }

  async load({ location, reservationNumber }) {
    const primaryAddress = location.addresses
      .find((address) => address.isPrimary === true) || location.addresses[0];

    return {
      reservationNumber,
      location,
      primaryAddress,
    };
  }
}

SuccessController.templateName = 'success';
SuccessController.routeName = 'success';

export default SuccessController;

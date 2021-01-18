import Controller from './controller';
import { t } from '../locales';

class SuccessController extends Controller {
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

import Controller from './controller';
import { t } from '../locales';

class ReserveController extends Controller {
  getTitle() {
    return t('reserve.title');
  }

  async load({ location }) {
    console.warn('route state', location);
  }
}

ReserveController.templateName = 'reserve';
ReserveController.routeName = 'reserve';

export default ReserveController;

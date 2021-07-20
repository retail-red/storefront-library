import Controller from './controller';
import { isButtonDisabled } from '../config';

class ReserveButtonController extends Controller {
  async load(state) {
    return {
      ...state,
      buttonDisabled: isButtonDisabled(this.config),
    };
  }

  updateConfig(config, updated) {
    super.updateConfig(config, updated);
    this.setState({
      buttonDisabled: isButtonDisabled(this.config),
    });
  }
}

ReserveButtonController.templateName = 'reserveButton';
ReserveButtonController.routeName = 'reserveButton';

export default ReserveButtonController;

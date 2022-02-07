import Controller from './controller';
import { isButtonDisabled } from '../config';

class ReserveButtonController extends Controller {
  async load(state) {
    const { ui } = this.config || {};

    return {
      ...state,
      buttonDisabled: isButtonDisabled(this.config),
      buttonClasses: ui.reserveButtonClasses ? ui.reserveButtonClasses : '',
    };
  }

  updateConfig(config, updated) {
    super.updateConfig(config, updated);
    this.setState({
      buttonDisabled: isButtonDisabled(this.config),
    });
  }

  domUpdated() {
    const button = document.querySelector('#rr-omni-reserve-button');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.state.callback(() => {
        const modalPlaceholder = this.app.publicInterface.Class._globalModalPlaceholderSingleton();
        this.app.start(modalPlaceholder);
      });
    });
  }
}

ReserveButtonController.templateName = 'reserveButton';
ReserveButtonController.routeName = 'reserveButton';

export default ReserveButtonController;

import defaultTemplates from '../templates/defaults';

class Controller {
  constructor(routeName, templateName, app, config, sdk) {
    this.routeName = routeName;
    this.templateName = templateName;
    this.app = app;
    this.config = config;
    this.sdk = sdk;
    this.state = {};

    // Load template
    this.template = this.config.templates.customTemplates[templateName]
      || defaultTemplates[templateName];
  }

  // eslint-disable-next-line no-empty-function
  async load() {}

  getTitle() {
    return '';
  }

  setState(state) {
    this.state = { ...this.state, ...state };
    this.render(this.previousTarget);
  }

  render(target) {
    // Save target for later re-rendering.
    this.previousTarget = target;

    // Render template and replace DOM content.
    const templateVariables = {
      ...this.config.templates.customVariables,
      ...this.state,
    };
    const html = this.template(templateVariables);
    // eslint-disable-next-line no-param-reassign
    target.innerHTML = html;
  }
}

export default Controller;

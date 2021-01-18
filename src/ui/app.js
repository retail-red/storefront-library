import { createHashHistory } from 'history';
import modalTemplate from '../templates/modal.hbs';

let routes = {};

class App {
  constructor(config, sdk) {
    this.config = config;
    this.sdk = sdk;
    this.routes = {};
    this.history = createHashHistory();
    this.historyIndex = 0;
    this.historyUnlisten = null;
    this.destroyWhenEmpty = true;
  }

  _handleHistoryChange({ location, action }) {
    // Store history index
    if (action === 'PUSH') {
      this.historyIndex += 1;
    } else if (action === 'POP') {
      this.historyIndex -= 1;
    }

    // Destroy application once we reach an unknown route.
    const { pathname, state } = location;
    const targetRoute = this.routes[pathname.slice(1)];
    if (!targetRoute) {
      if (this.destroyWhenEmpty) {
        this.destroy();
      }
      return;
    }

    // Create the routes controller if not available yet.
    const { controllerId, ...routeState } = state || {};
    if (!controllerId) {
      const RouteController = targetRoute;
      const newController = new RouteController(
        RouteController.routeName,
        RouteController.templateName,
        this,
        this.config,
        this.sdk,
      );
      const newId = Object.keys(routes).length;
      routes[newId] = newController;
      this.history.replace(targetRoute, { ...routeState, controllerId: newId });
      return;
    }
    const controller = routes[controllerId];

    // Load content
    const asyncHandler = async () => {
      if (!controller.loaded) {
        const { skipRendering = false, ...output } = await controller.load(routeState);
        controller.state = {
          route: state,
          ...controller.state,
          ...(output || {}),
        };
        controller.loaded = true;

        // Allows redirects to not trigger unneeded first time render.
        if (skipRendering) return;
      }

      // Render content.
      controller.render(this.modalContent);

      // Update title.
      this.modalTitle.innerText = controller.getTitle();

      // Update back button
      if (this.historyIndex >= 2 && this.modalBack.classList.contains('sg-back-hidden')) {
        this.modalBack.classList.remove('sg-back-hidden');
      } else if (this.historyIndex <= 1 && !this.modalBack.classList.contains('sg-back-hidden')) {
        this.modalBack.classList.add('sg-back-hidden');
      }
    };
    asyncHandler();
  }

  start(target) {
    // Start listening to history
    this.historyIndex = 0;
    this.historyUnlisten = this.history.listen((o) => this._handleHistoryChange(o));

    // Build base.
    // eslint-disable-next-line no-param-reassign
    target.innerHTML = modalTemplate();
    this.element = target;

    // Store modal content placeholder.
    const modalContent = document.querySelector('#sg-omni .sg-modal-content');
    const modalTitle = document.querySelector('#sg-omni .sg-modal-title');
    const modalBack = document.querySelector('#sg-omni .sg-back');
    this.modalContent = modalContent;
    this.modalTitle = modalTitle;
    this.modalBack = modalBack;

    // Handle modal closing.
    const modalBackdrop = document.querySelector('#sg-omni .sg-modal-backdrop');
    modalBackdrop.addEventListener('click', () => this.destroy());
    const modalClose = document.querySelector('#sg-omni .sg-modal-close');
    modalClose.addEventListener('click', () => this.destroy());
    modalBack.addEventListener('click', () => this.popRoute());

    // Transition modal in.
    const baseElement = document.querySelector('#sg-omni');
    setTimeout(() => requestAnimationFrame(() => baseElement.classList.add('sg-modal-open')), 0);
    this.modalBase = baseElement;

    // Push starting route configuration
    this.pushRoute('storeList', { locationCode: this.config.locationCode });
  }

  updateConfig(config) {
    this.config = config;
  }

  destroy() {
    // Clear up all resources.
    this.historyUnlisten();
    this.popToRoot();
    routes = {};

    // Hide modal and remove from DOM.
    this.modalBase.classList.remove('sg-modal-open');
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.modalBase = null;
        this.modalContent = null;
        this.modalTitle = null;
        this.modalBack = null;
        this.element.innerHTML = '';
        this.element = null;
      }, 225);
    });
  }

  addController(controller) {
    this.routes[controller.routeName] = controller;
  }

  pushRoute(name, state = {}) {
    this.history.push(`/${name}`, state);
  }

  popRoute() {
    this.history.back();
  }

  resetTo(name, state) {
    this.destroyWhenEmpty = false;
    this.history.go(-this.historyIndex);
    setTimeout(() => {
      this.historyIndex = 0;
      this.history.push(`/${name}`, state);
      this.destroyWhenEmpty = true;
    }, 10);
  }

  popToRoot() {
    if (this.historyIndex === 0) return;

    this.history.go(-this.historyIndex);
    requestAnimationFrame(() => {
      this.historyIndex = 0;
    });
  }
}

export default App;

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
    this.loading = false;
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
      this.setLoading(false);

      // Update title.
      this.modalTitle.innerText = controller.getTitle();

      // Update back button
      if (this.historyIndex >= 2 && this.modalBack.classList.contains('rr-back-hidden')) {
        this.modalBack.classList.remove('rr-back-hidden');
      } else if (this.historyIndex <= 1 && !this.modalBack.classList.contains('rr-back-hidden')) {
        this.modalBack.classList.add('rr-back-hidden');
      }
    };

    this.setLoading(true);
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
    const modalContent = document.querySelector('#rr-omni .rr-modal-content');
    const modalTitle = document.querySelector('#rr-omni .rr-modal-title');
    const modalBack = document.querySelector('#rr-omni .rr-back');
    this.modalContent = modalContent;
    this.modalTitle = modalTitle;
    this.modalBack = modalBack;

    // Handle modal closing.
    const modalBackdrop = document.querySelector('#rr-omni .rr-modal-backdrop');
    modalBackdrop.addEventListener('click', () => this.destroy());
    const modalClose = document.querySelector('#rr-omni .rr-modal-close');
    modalClose.addEventListener('click', () => this.destroy());
    modalBack.addEventListener('click', () => this.popRoute());

    // Transition modal in.
    const baseElement = document.querySelector('#rr-omni');
    setTimeout(() => requestAnimationFrame(() => baseElement.classList.add('rr-modal-open')), 0);
    this.modalBase = baseElement;

    // Prevent document from scrolling
    document.querySelector('body').classList.add('rr-modal-backdrop-body-fix');

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
    this.modalBase.classList.remove('rr-modal-open');
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

    // Re-enable document scrolling
    document.querySelector('body').classList.remove('rr-modal-backdrop-body-fix');
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

  syncLoadingState() {
    const progressLine = document.querySelector('.rr-progress-line');
    if (!progressLine) {
      return;
    }

    if (this.loading) {
      progressLine.classList.add('rr-progress-visible');
    } else {
      progressLine.classList.remove('rr-progress-visible');
    }
  }

  setLoading(value) {
    this.loading = value;
    this.syncLoadingState();
  }
}

export default App;

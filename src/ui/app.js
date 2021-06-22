import { createHashHistory, createMemoryHistory } from 'history';
import isEqual from 'lodash/isEqual';
import modalTemplate from '../templates/modal.hbs';

let routes = {};

class App {
  constructor(config, sdk, instance) {
    this.config = config;
    this.sdk = sdk;
    this.routes = {};
    this.history = config.browserHistory ? createHashHistory() : createMemoryHistory();
    this.lastHistory = {};
    this.historyIndex = 0;
    this.historyUnlisten = null;
    this.endReached = false;
    this.loading = false;
    this.publicInterface = instance;
  }

  _buildController(targetRoute) {
    const RouteController = targetRoute;
    const newController = new RouteController(
      RouteController.routeName,
      RouteController.templateName,
      this,
      this.config,
      this.sdk,
    );
    return newController;
  }

  _handleHistoryChange({ location, action }) {
    // Close if terminal route reached.
    if (this.endReached) {
      this.destroy();
    }

    // Avoid history void loop - Happens when browser history interferes with the "history" module.
    const { key, ...comparedLocation } = location;
    if (isEqual(this.lastHistory, comparedLocation)) {
      return;
    }
    this.lastHistory = JSON.parse(JSON.stringify(comparedLocation));

    // Store history index
    if (action === 'PUSH') {
      this.historyIndex += 1;
    } else if (action === 'POP' && this.historyIndex <= 1) {
      this.destroy();
      return;
    } else if (action === 'POP') {
      this.historyIndex -= 1;
    }

    // Destroy application once we reach an unknown route.
    const { pathname, state } = location;
    const targetRoute = this.routes[pathname.slice(1)];
    if (!targetRoute) {
      this.destroy();
      return;
    }

    // Create the routes controller if not available yet.
    const { controllerId, ...routeState } = state || {};
    if (typeof controllerId === 'undefined') {
      const newController = this._buildController(targetRoute);
      const newId = Object.keys(routes).length;
      routes[newId] = newController;
      this.history.replace(targetRoute, { ...routeState, controllerId: newId });
      return;
    }

    const controller = routes[controllerId];

    // Route has been removed already.
    if (!controller) {
      return;
    }

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

  /**
   * Initiates flow and opens the reservation modal.
   */
  start(target, state = {}, initialRoute = 'storeList') {
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
    modalBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.destroy();
    });
    const modalClose = document.querySelector('#rr-omni .rr-modal-close');
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.destroy();
    });
    modalBack.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.popRoute();
    });

    // Transition modal in.
    const baseElement = document.querySelector('#rr-omni');
    setTimeout(() => requestAnimationFrame(() => baseElement.classList.add('rr-modal-open')), 10);
    this.modalBase = baseElement;

    // Prevent document from scrolling
    document.querySelector('body').classList.add('rr-modal-backdrop-body-fix');

    // Push starting route configuration
    this.pushRoute(initialRoute, { locationCode: this.config.locationCode, ...state });
  }

  /**
   * Renders a controller inlined into any given container.
   * DOES NOT SUPPORT history within the inline element yet.
   */
  renderInline(target, route, state = {}, isMain = false) {
    // Initialize controller
    const RouteController = this.routes[route];
    const controller = new RouteController(
      RouteController.routeName,
      RouteController.templateName,
      this,
      this.config,
      this.sdk,
    );
    this.activeInlineController = this.activeInlineController || [];
    this.activeInlineController.push(controller);
    this.activeInlineControllerMain = isMain;

    // Render content
    const handler = async () => {
      try {
        const loadState = await controller.load(state);
        controller.state = loadState || {};
        controller.render(target);
      } catch (error) {
        // Fallback to error page.
        this.renderInline(target, 'error', { error });
      }
    };
    handler();
  }

  updateConfig(config, changed) {
    this.config = config;

    // Update the active inline controller.
    if (this.activeInlineController) {
      this.activeInlineController.forEach((controller) => {
        if (controller.updateConfig) {
          controller.updateConfig(config, changed);
        }
      });
    }
  }

  destroy() {
    // Clear up all resources.
    this.historyUnlisten();
    this.historyIndex = 0;
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
        this.endReached = false;
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

  pushEndRoute(name, state) {
    // Render content.
    if (this.activeInlineController && this.activeInlineControllerMain) {
      const newController = this._buildController(this.routes[name]);
      const load = async () => {
        const output = await newController.load(state);
        newController.state = output || {};
        newController.render(
          this.activeInlineController[this.activeInlineController.length - 1]
            .previousTarget,
        );
      };
      load();
      return;
    }

    this.historyIndex = 0;
    this.history.push(`/${name}`, state);

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.endReached = true;
      }, 100);
    });
  }

  popRoute() {
    this.history.back();
  }

  syncLoadingState() {
    const progressLine = document.querySelector('.rr-header .rr-progress-line');
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

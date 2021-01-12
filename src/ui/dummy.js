import Controller from './controller';

class DummyController extends Controller {
  getTitle() {
    return 'Dummy Title';
  }

  async load() {
    console.warn('loading dummy');
    return {
      test: Math.random(),
    };
  }
}

DummyController.templateName = 'dummy';
DummyController.routeName = 'dummy';

export default DummyController;

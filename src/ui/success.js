import Controller from './controller';
import { t } from '../locales';

class SuccessController extends Controller {
  getTitle() {
    return t('success_title');
  }

  async load() {
    const location = {
      code: 'LOCATION123',
      name: 'Awesome retail store somewhere',
      type: {
        code: 'warehouse',
        name: 'Warehouse',
      },
      status: 'active',
      latitude: 30.286858,
      longitude: -97.745575,
      distance: 5,
      unitSystem: 'imperial',
      operationHours: {
        sun: '10:00am - 8:00pm',
        mon: '10:00am - 8:00pm',
        tue: '10:00am - 8:00pm',
        wed: '10:00am - 8:00pm',
        thu: '10:00am - 8:00pm',
        fri: '10:00am - 8:00pm',
        sat: '10:00am - 8:00pm',
      },
      localeCode: 'en-us',
      timeZone: 'Europe/Berlin',
      addresses: [
        {
          code: 'WHS',
          name: 'Billing address',
          street: '12 Somestreet',
          street2: '',
          street3: '',
          street4: '',
          postalCode: 78732,
          city: 'Austin',
          region: 'TX',
          country: 'DE',
          phoneNumber: '000-000-0000',
          faxNumber: '000-000-0000',
          emailAddress: 'somelocation@someRetailer.com',
          isPrimary: false,
        },
      ],
      isComingSoon: true,
      isDefault: false,
      inventory: {
        isManaged: true,
        mode: 'blind',
        safetyStockMode: 'disabled',
        safetyStock: 10,
        safetyStockType: 'percentage',
      },
    };

    const primaryAddress = location.addresses.find((address) => address.isPrimary === true) || location.addresses[0];

    console.warn('loading success');
    return {
      reservationNumber: 123456890,
      location,
      primaryAddress,
    };
  }
}

SuccessController.templateName = 'success';
SuccessController.routeName = 'success';

export default SuccessController;

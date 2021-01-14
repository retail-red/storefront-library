import countriesList from 'i18n-iso-countries/langs/en.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  storeList: {
    title: 'Find a store near you',
    emptyList: 'No nearby stores found at your location.',
    quantity: 'Quantity',
    search: {
      label: 'Postal Code',
      countryLabel: 'Country',
      buttonLabel: 'Search',
    },
  },
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
  success: {
    title: 'Reservation Confirmation',
    headline: 'Thank you for your reservation',
    text: 'We will send you a email/text message shortly when your reservation is ready to pickup.',
    reservation_number: 'Your reservation number is:',
    location: {
      address: 'Address',
      phone: 'Phone',
      store_hours: 'Store Hours',
      directions: 'Directions',
    },
  },
};

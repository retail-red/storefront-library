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
  success_title: 'Reservation Confirmation',
};

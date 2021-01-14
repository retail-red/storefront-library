import countriesList from 'i18n-iso-countries/langs/en.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  format: {
    decimalSymbol: '.',
    groupSymbol: ',',
  },
  storeList: {
    title: 'Find a store near you',
    emptyList: 'No nearby stores found at your location.',
    quantity: 'Quantity',
    uncollapse: 'Show store details',
    collapse: 'Hide store details',
    reserve: 'Reserve',
    comingSoon: 'Coming Soon',
    location: {
      address: 'Address',
      storeHours: 'Store Hours',
      directions: 'Directions',
    },
    search: {
      label: 'Postal Code',
      countryLabel: 'Country',
      buttonLabel: 'Search',
    },
    inventory: {
      available: 'Available',
      unavailable: 'Unavailable',
      exact: '{{x}} Available',
      rough: '{{x}}+ Available',
    },
  },
  reserve: {
    title: 'Submit Reservation',
  },
};

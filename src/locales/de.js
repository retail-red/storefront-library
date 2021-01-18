import countriesList from 'i18n-iso-countries/langs/en.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  format: {
    decimalSymbol: '.',
    groupSymbol: ',',
  },
  date: {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  },
  errors: {
    unknown: 'Failed to submit resevation',
    validation: {
      isRequired: 'Field is required',
      isEmail: 'Field must be a valid email address',
      isPhone: 'Field must be a valid phone number with country code (+49 1234)',
    },
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
    changeStore: 'Change Store',
    contactInfo: 'Reservation Contact Info',
    pickupQuestion: 'Who will pickup this reservation?',
    me: 'Me',
    someoneElse: 'Someone else',
    pickupInfo: 'Who will pickup this reservation?',
    firstName: 'First Name',
    lastName: 'Last Name',
    phoneNumber: 'Phone Number',
    email: 'Email Address',
    submit: 'Submit Reservation',
    terms: {
      text: 'I have read and accepted the',
      link: 'terms and conditions',
    },
    privacy: {
      text: 'I have read and accepted the',
      link: 'privacy policy',
    },
  },
  success: {
    title: 'Reservation Confirmation',
    headline: 'Thank you for your reservation',
    text: 'We will send you a email/text message shortly when your reservation is ready to pickup.',
    reservationNumber: 'Your reservation number is:',
    location: {
      address: 'Address',
      phone: 'Phone',
      storeHours: 'Store Hours',
      directions: 'Directions',
    },
  },
};

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
  addresses: {
    line1: '{{street}}',
    line2: '{{street2}}',
    line3: '{{city}}, {{postalCode}}',
    tel: 'Tel.:',
  },
  errors: {
    unknown: 'Failed to submit reservation',
    validation: {
      isRequired: 'Field is required',
      isEmail: 'Field must be a valid email address',
      isPhone: 'Field must be a valid phone number',
    },
  },
  storeList: {
    title: 'Find a store near you',
    emptyList: 'No nearby stores found at your location.',
    quantity: 'Quantity',
    uncollapse: 'Show store details',
    collapse: 'Hide store details',
    reserve: 'Reserve',
    select: 'Choose',
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
      exact: 'Available ({{x}})',
      rough: 'Available ({{x}}+)',
    },
  },
  reserveButton: {
    title: 'Reserve and Pickup',
  },
  reserve: {
    title: 'Submit reservation',
    changeStore: 'Change Store',
    contactInfo: 'Reservation contact info',
    pickupQuestion: 'Who will pick up this reservation?',
    me: 'Me',
    someoneElse: 'Someone else',
    pickupInfo: 'Who will pick up this reservation?',
    firstName: 'First Name',
    lastName: 'Last Name',
    phoneNumber: 'Phone Number',
    email: 'Email Address',
    submit: 'Submit reservation',
    terms: {
      text: 'I have read and accepted the {{child}}.',
      link: 'terms and conditions',
    },
    privacy: {
      text: 'I have read and accepted the {{child}}.',
      link: 'privacy policy',
    },
    termsPrivacy: {
      text: 'I have read and accepted the {{child}} & {{child_1}}.',
    },
    newsletterOptIn: 'I want to subscribe to your newsletter and get updates about new products & offers. I can unsubscribe at any moment.',
  },
  success: {
    title: 'Reservation Confirmation',
    headline: 'Thank you for your reservation!',
    text: 'We will send you an email/text message shortly when your reservation is ready to pick up.',
    reservationNumber: 'Your reservation number is:',
    location: {
      address: 'Address',
      phone: 'Phone',
      storeHours: 'Store Hours',
      directions: 'Directions',
    },
  },
  liveInventory: {
    searchPostalCode: 'Show availability in stores nearby.',
    searchDirect: 'Show availability in your store.',
    postalCode: 'Postal Code',
    reserveOther: 'Check other Stores',
    find: 'Find Store',
    yourStore: 'Your Store:',
    change: 'Change',
    select: 'Select Store',
    pleaseSelect: 'Please select your store',
    cancel: 'Cancel',
    list: {
      unavailable: '(Unavailable)',
      comingSoon: '(Coming Soon)',
    },
  },
};

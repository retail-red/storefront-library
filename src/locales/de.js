import countriesList from 'i18n-iso-countries/langs/de.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  storeList: {
    title: 'Filiale in der Nähe finden',
    emptyList: 'In dieser Gegend haben wir leider keine Filialen.',
    quantity: 'Anzahl',
    search: {
      label: 'Postleitzahl',
      countryLabel: 'Land',
      buttonLabel: 'Suchen',
    },
  },
  mon: 'Montag',
  tue: 'Dienstag',
  wed: 'Mittwoch',
  thu: 'Donnerstag',
  fri: 'Freitag',
  sat: 'Samstag',
  sun: 'Sonntag',
  success: {
    title: 'Reservierungsbestätigung',
    headline: 'Vielen Dank für Ihre Reservierung!',
    text: 'Wir senden Ihnen in Kürze eine E-Mail/SMS Nachricht, sobald Ihre Reservierung bereit zur Abholung ist.',
    reservation_number: 'Ihre Reservierungs-Nr. ist:',
    location: {
      address: 'Adresse',
      phone: 'Tel.',
      store_hours: 'Öffnungszeiten',
      directions: 'Route anzeigen',
    },
  },
};

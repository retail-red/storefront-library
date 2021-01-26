import countriesList from 'i18n-iso-countries/langs/en.json';
import { countryListTransform } from './util';

export default {
  countries: countryListTransform(countriesList),
  format: {
    decimalSymbol: ',',
    groupSymbol: '.',
  },
  date: {
    mon: 'Montag',
    tue: 'Dienstag',
    wed: 'Mittwoch',
    thu: 'Donnerstag',
    fri: 'Freitag',
    sat: 'Samstag',
    sun: 'Sonntag',
  },
  errors: {
    unknown: 'Reservierung konnte nicht aufgegebn werden.',
    validation: {
      isRequired: 'Feld is erforderlich.',
      isEmail: 'Feld muss eine korrekte E-Mail-Adresse sein.',
      isPhone: 'Feld muss eine korrekte Telefon-Nr sein. (+49 1234)',
    },
  },
  storeList: {
    title: 'Filialen in der Nähe',
    emptyList: 'Keine Filialen in der Nähe gefunden.',
    quantity: 'Anzahl',
    uncollapse: 'Mehr Details',
    collapse: 'Weniger Details',
    reserve: 'Reservieren',
    comingSoon: 'Bald Verfügbar',
    location: {
      address: 'Adresse',
      storeHours: 'Öffnungszeiten',
      directions: 'Wegbeschreibung',
    },
    search: {
      label: 'Postleitzahl',
      countryLabel: 'Land',
      buttonLabel: 'Suchen',
    },
    inventory: {
      available: 'Verfügbar',
      unavailable: 'Nicht Verfügbar',
      exact: '{{x}} Verfügbar',
      rough: '{{x}}+ Verfügbar',
    },
  },
  reserveButton: {
    title: 'Reservieren und Abholen',
  },
  reserve: {
    title: 'Reservierung abschicken',
    changeStore: 'Filiale wechseln',
    contactInfo: 'Reservierungs Kontakt',
    pickupQuestion: 'Wer wird die Bestellung abholen?',
    me: 'Ich',
    someoneElse: 'Jemand anderes',
    pickupInfo: 'Wer wird die Bestellung abholen?',
    firstName: 'Vorname',
    lastName: 'Nachname',
    phoneNumber: 'Tel. Nr.',
    email: 'E-Mail-Adresse',
    submit: 'Reservierung abschicken',
    terms: {
      text: 'Ich habe die {{child}} gelesen und erkläre mich einverstanden.',
      link: 'Nutzungsbedingungen',
    },
    privacy: {
      text: 'Ich habe die {{child}} gelesen und erkläre mich einverstanden.',
      link: 'Datenschutzerklärung',
    },
  },
  success: {
    title: 'Reservierungs Bestätigung',
    headline: 'Danke für Deine Reservierung',
    text: 'Wir senden eine Benachrichtigung sobald Deine Reservierung abholbreit ist.',
    reservationNumber: 'Deine Reservierungs Nr.:',
    location: {
      address: 'Adresse',
      phone: 'Tel.Nr.',
      storeHours: 'Öffnungszeiten',
      directions: 'Wegbeschreibung',
    },
  },
};

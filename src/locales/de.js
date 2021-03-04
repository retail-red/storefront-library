import countriesList from 'i18n-iso-countries/langs/de.json';
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
  addresses: {
    line1: '{{street}} {{street2}}',
    line2: '{{postalCode}} {{city}}',
    tel: 'Tel.:',
  },
  errors: {
    unknown: 'Reservierung konnte nicht aufgegeben werden.',
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
    select: 'Wählen',
    comingSoon: 'Bald Verfügbar',
    location: {
      address: 'Adresse',
      storeHours: 'Öffnungszeiten',
      directions: 'Route berechnen',
    },
    search: {
      label: 'Postleitzahl',
      countryLabel: 'Land',
      buttonLabel: 'Suchen',
    },
    inventory: {
      available: 'Verfügbar',
      unavailable: 'Nicht Verfügbar',
      exact: 'Verfügbar ({{x}})',
      rough: 'Verfügbar ({{x}}+)',
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
    text: 'Wir senden eine Benachrichtigung sobald Deine Reservierung abholbereit ist.',
    reservationNumber: 'Deine Reservierungs Nr.:',
    location: {
      address: 'Adresse',
      phone: 'Tel.Nr.',
      storeHours: 'Öffnungszeiten',
      directions: 'Wegbeschreibung',
    },
  },
  liveInventory: {
    searchPostalCode: 'Verfügbarkeit bei Filialen in der Nähe anzeigen.',
    searchDirect: 'Verfügbarkeit in Ihrer Filiale anzeigen.',
    postalCode: 'PLZ',
    reserveOther: 'Andere Filiale prüfen',
    find: 'Filiale finden',
    yourStore: 'Ihre Filiale:',
    change: 'ändern',
    select: 'Ihre Filiale wählen',
    pleaseSelect: 'Bitte wählen Sie Ihre Filiale',
    cancel: 'abbrechen',
    list: {
      unavailable: '(Nicht Verfügbar)',
      comingSoon: '(Bald Verfügbar)',
    },
  },
};

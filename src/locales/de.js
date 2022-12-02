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
    line1: '{{street}}',
    line2: '{{street2}}',
    line3: '{{postalCode}} {{city}}',
    tel: 'Tel.:',
  },
  errors: {
    unknown: 'Reservierung konnte nicht aufgegeben werden',
    validation: {
      isRequired: 'Feld ist erforderlich',
      isEmail: 'Feld muss eine korrekte E-Mail-Adresse sein',
      isPhone: 'Feld muss eine korrekte Telefon-Nr sein',
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
      ariaLabel: 'Suchen nach Standort',
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
    contactInfo: 'Reservierungskontakt',
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
      link: 'AGB',
    },
    privacy: {
      text: 'Ich habe die {{child}} gelesen und erkläre mich einverstanden.',
      link: 'Datenschutzerklärung',
    },
    termsPrivacy: {
      text: 'Ich habe die {{child}} und die {{child_1}} gelesen und erkläre mich einverstanden.',
    },
    newsletterOptIn: 'Ich möchte mich für Ihren Newsletter anmelden und über neue Produkte & Angebote informiert werden. Ich kann mich jederzeit wieder abmelden.',
    saveCustomerData: 'Eingaben für die nächste Reservierung speichern.',
  },
  success: {
    title: 'Reservierungsbestätigung',
    headline: 'Danke für Deine Reservierung!',
    text: 'Wir senden eine Benachrichtigung, sobald Deine Reservierung abholbereit ist.',
    reservationNumber: 'Deine Reservierungsnummer:',
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
  apiProduct: {
    options: {
      pleaseSelect: '{{option_name}} auswählen',
    },
  },
};

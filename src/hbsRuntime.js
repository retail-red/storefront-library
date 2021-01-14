import handlebars from 'handlebars';
import { t } from './locales';
import { createDirectionsLink } from './util/map';
import textFieldPartial from './templates/partials/textField.hbs';
import selectFieldPartial from './templates/partials/select.hbs';
import buttonPartial from './templates/partials/button.hbs';
import linkPartial from './templates/partials/link.hbs';

handlebars.registerHelper('t', (p, options) => new handlebars.SafeString(t(p, options.hash || {})));
handlebars.registerHelper('select', (condition, a, b) => (condition ? a : b));
// eslint-disable-next-line no-console
handlebars.registerHelper('debug', (a) => console.log(a));
handlebars.registerHelper('or', (a, b) => a || b);
handlebars.registerHelper('isNull', (a) => a === null);
handlebars.registerHelper('gte', (a, b) => a >= b);
handlebars.registerHelper('gt', (a, b) => a > b);
handlebars.registerHelper('lte', (a, b) => a <= b);
handlebars.registerHelper('lt', (a, b) => a < b);
handlebars.registerHelper('object', ({ hash }) => hash);
handlebars.registerHelper('distance', (distance, unitSystem) => `${distance
  .toFixed(2)
  .replace('.', t('format.decimalSymbol'))
  .replace(/(\d)(?=(\d{3})+(?!\d))/g, `${t('format.groupSymbol')}`)
} ${unitSystem === 'metric' ? 'km' : 'miles'}`);
handlebars.registerHelper('direction', (address) => createDirectionsLink(address));

handlebars.registerPartial('textField', textFieldPartial);
handlebars.registerPartial('select', selectFieldPartial);
handlebars.registerPartial('button', buttonPartial);
handlebars.registerPartial('link', linkPartial);

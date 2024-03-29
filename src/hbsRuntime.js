import handlebars from 'handlebars';
import { t, hasTranslation } from './locales';
import { createDirectionsLink } from './util/map';
import textFieldPartial from './templates/partials/textField.hbs';
import textFieldPhonePartial from './templates/partials/textFieldPhone.hbs';
import textAreaPartial from './templates/partials/textArea.hbs';
import selectFieldPartial from './templates/partials/select.hbs';
import buttonPartial from './templates/partials/button.hbs';
import linkPartial from './templates/partials/link.hbs';
import radioPartial from './templates/partials/radio.hbs';
import checkboxPartial from './templates/partials/checkbox.hbs';
import skeletonPartial from './templates/partials/skeleton.hbs';
import productImagePartial from './templates/partials/productImage.hbs';
import apiProductOptionsPartial from './templates/partials/apiProductOptions.hbs';

handlebars.registerHelper('t', (p, options) => new handlebars.SafeString(t(p, options.hash || {})));
handlebars.registerHelper('hasTranslation', (p) => hasTranslation(p));
handlebars.registerHelper('select', (condition, a, b) => (condition ? a : b));
handlebars.registerHelper('concat', (...args) => {
  args.pop();
  return args.join('');
});
// eslint-disable-next-line no-console
handlebars.registerHelper('debug', (a) => console.log(a));
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('or', (a, b) => a || b);
handlebars.registerHelper('and', (a, b) => a && b);
handlebars.registerHelper('not', (a) => !a);
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
// eslint-disable-next-line no-irregular-whitespace
} ${unitSystem === 'metric' ? 'km' : 'miles'}`);
handlebars.registerHelper('direction', (address) => createDirectionsLink(address));

handlebars.registerPartial('textField', textFieldPartial);
handlebars.registerPartial('textFieldPhone', textFieldPhonePartial);
handlebars.registerPartial('textArea', textAreaPartial);
handlebars.registerPartial('select', selectFieldPartial);
handlebars.registerPartial('button', buttonPartial);
handlebars.registerPartial('link', linkPartial);
handlebars.registerPartial('radio', radioPartial);
handlebars.registerPartial('checkbox', checkboxPartial);
handlebars.registerPartial('skeleton', skeletonPartial);
handlebars.registerPartial('apiProductOptions', apiProductOptionsPartial);
handlebars.registerPartial('productImage', productImagePartial);
handlebars.registerPartial('tt', (key, { data }) => {
  // Create DOM nodes of the children
  const wrapper = document.createElement('div');
  wrapper.innerHTML = data['partial-block'](data.root);

  const children = Array.from(wrapper.children);

  if (!children.length) {
    // No children - no translation
    return key;
  }

  // Create the options of the translation function
  const options = children.reduce((acc, child, index) => {
    acc[`child${index !== 0 ? `_${index}` : ''}`] = child.outerHTML;
    return acc;
  }, {});

  return t(key, options);
});

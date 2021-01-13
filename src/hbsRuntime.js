import handlebars from 'handlebars';
import { t } from './locales';
import textFieldPartial from './templates/partials/textField.hbs';
import selectFieldPartial from './templates/partials/select.hbs';
import buttonPartial from './templates/partials/button.hbs';

handlebars.registerHelper('t', (p) => new handlebars.SafeString(t(p)));
handlebars.registerPartial('textField', textFieldPartial);
handlebars.registerPartial('select', selectFieldPartial);
handlebars.registerPartial('button', buttonPartial);

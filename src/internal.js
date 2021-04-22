// Extra configuration
const extraStoredConfigs = [];
let extraDefaultConfig = {};

export function addStoredConfig(key) {
  extraStoredConfigs.push(key);
}

export function getExtraStoredConfig() {
  return extraStoredConfigs;
}

export function setDefaultConfig(config) {
  extraDefaultConfig = config;
}

export function getExtraDefaultConfig() {
  return extraDefaultConfig;
}

// Extra templating
const extraTemplates = {};

export function addTemplate(name, template) {
  extraTemplates[name] = template;
}

export function getExtraTemplates() {
  return extraTemplates;
}

// I18n
const extraTranslations = {};

export function addLanguage(language, strings) {
  extraTranslations[language] = strings;
}

export function getExtraLanguages() {
  return extraTranslations;
}

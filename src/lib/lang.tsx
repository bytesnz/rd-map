let defaultLanguage;

export const getLangString = (...strings) => {
  let i;

  for (i = 0; i < strings.length;  i++) {
    if (strings[i]) {
      if (typeof strings[i] === 'string') {
        return strings[i];
      }
      if (defaultLanguage && strings[i][defaultLanguage]) {
        return strings[i][defaultLanguage];
      }
      const langs = Object.keys(strings[i]);
      if (langs.length) {
        return strings[i][langs[0]];
      }
    }
  }
};

export const setDefaultLang = (lang: string) => {
  defaultLanguage = lang;
};

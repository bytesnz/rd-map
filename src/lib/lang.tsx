let defaultLanguage;

export type LangString = string | string[] | {
  [language: string]: string | string[]
};

const getLangValue = (langString: LangString): string => {
  if (langString) {
    if (typeof langString === 'string') {
      return langString;
    }
    if (defaultLanguage && langString[defaultLanguage]) {
      return langString[defaultLanguage];
    }
    const langs = Object.keys(langString);
    if (langs.length) {
      return langString[langs[0]];
    }
  }
};

export const getLangString = (...strings: LangString[]): string => {
  let i;

  for (i = 0; i < strings.length;  i++) {
    const langString = strings[i];
    if (langString instanceof Array) {
      for(let j = 0; j < langString.length; j++) {
        const value = getLangValue(langString[j]);
        if (value) {
          return value;
        }
      }
    } else {
      const value = getLangValue(langString);
      if (value) {
        return value;
      }
    }
  }
};

export const setDefaultLang = (lang: string) => {
  defaultLanguage = lang;
};

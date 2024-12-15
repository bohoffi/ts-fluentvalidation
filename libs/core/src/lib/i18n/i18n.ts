import { en } from './en';

type LanguageKeys = keyof typeof i18n.languages;

const i18n = {
  currentLanguage: 'en',
  languages: {
    en: en
  },

  setLanguage(language: LanguageKeys): void {
    if (!this.languages[language]) {
      throw new Error(`Language '${language}' is not defined.`);
    }
    this.currentLanguage = language;
  },

  getLanguage(): string {
    return this.currentLanguage;
  },

  addLanguage(language: string, messages: Record<string, string>): void {
    this.languages[language] = messages;
  },

  getMessage(errorCode: string): string {
    return this.languages[this.currentLanguage][errorCode] || 'Validation failed';
  }
};

export { i18n };

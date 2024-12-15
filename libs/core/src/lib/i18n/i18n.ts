import { de } from './de';
import { en } from './en';

/**
 * Global i18n object managing the current language and messages.
 */
export interface I18n {
  /**
   * The current language.
   */
  currentLanguage: string;
  /**
   * The available languages.
   */
  languages: Record<string, Record<string, string>>;
  /**
   * Set the current language.
   *
   * @param language The language to set.
   */
  setLanguage(language: string): void;
  /**
   * Get the current language.
   */
  getLanguage(): string;
  /**
   * Add a new language.
   *
   * @param language Language code.
   * @param messages Messages for the language.
   */
  addLanguage(language: string, messages: Record<string, string>): void;
  /**
   * Get a message for a given error code.
   *
   * @param errorCode The error code.
   */
  getMessage(errorCode: string): string;
  /**
   * Set a message for a given error code.
   *
   * @param errorCode The error code.
   * @param message The message.
   * @param language The language to set the message for - defaults to `currentLanguage`.
   */
  setMessage(errorCode: string, message: string, language?: string): void;
  /**
   * Add a message for a given error code.
   *
   * @param errorCode The error code.
   * @param message The message.
   * @param language The language to set the message for - defaults to `currentLanguage`.
   */
  addMessage(errorCode: string, message: string, language?: string): void;
}

/**
 * @internal
 */
const i18n: I18n = {
  currentLanguage: 'en',
  languages: {
    de: de,
    en: en
  },

  setLanguage(language: string): void {
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
  },

  setMessage(errorCode: string, message: string, language?: string): void {
    this.languages[language ?? this.currentLanguage][errorCode] = message;
  },

  addMessage(errorCode: string, message: string, language?: string): void {
    this.languages[language ?? this.currentLanguage][errorCode] = message;
  }
};

export { i18n };

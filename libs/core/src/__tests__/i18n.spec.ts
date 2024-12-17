import { en } from '../lib/i18n/en';
import { i18n } from '../lib/i18n/i18n';

describe('i18n', () => {
  describe('i18n object', () => {
    it(`should have a currentLanguage property set to 'en' by default`, () => {
      expect(i18n.currentLanguage).toBeDefined();
      expect(i18n.currentLanguage).toBe('en');
    });

    it(`should have a languages property that contains an 'en' object`, () => {
      expect(i18n.languages).toBeDefined();
      expect(i18n.languages['en']).toBeDefined();
    });

    it(`should have a setLanguage method`, () => {
      expect(typeof i18n.setLanguage).toBe('function');
    });

    it(`should have a getLanguage method`, () => {
      expect(typeof i18n.getLanguage).toBe('function');
    });

    it(`should have an addLanguage method`, () => {
      expect(typeof i18n.addLanguage).toBe('function');
    });

    it(`should have a getMessage method`, () => {
      expect(typeof i18n.getMessage).toBe('function');
    });

    it(`should return the correct message when calling getMessage`, () => {
      expect(i18n.getMessage('required')).toBe("'{propertyName}' is required.");
    });

    it(`should throw an error when calling setLanguage with an invalid language`, () => {
      expect(() => i18n.setLanguage('invalid')).toThrow(`Language 'invalid' is not defined.`);
    });

    it(`should set the current language when calling setLanguage`, () => {
      i18n.setLanguage('en');
      expect(i18n.currentLanguage).toBe('en');
    });

    it(`should return the current language when calling getLanguage`, () => {
      expect(i18n.getLanguage()).toBe('en');
    });

    it(`should add a new language when calling addLanguage`, () => {
      i18n.addLanguage('fr', { test: 'test' });
      expect(i18n.languages['fr']).toBeDefined();
    });

    it(`should return the correct message when calling getMessage with a different language`, () => {
      i18n.setLanguage('fr');
      i18n.addLanguage('fr', { required: 'test' });
      expect(i18n.getMessage('required')).toBe('test');
    });

    it(`should return 'Validation failed' when calling getMessage with an invalid error code`, () => {
      expect(i18n.getMessage('invalid')).toBe('Validation failed');
    });
  });

  describe('en', () => {
    const englishMessages = en;

    beforeEach(() => {
      i18n.setLanguage('en');
    });

    it.each(Object.entries(englishMessages))(`should expected message for %s`, (key, message) => {
      expect(i18n.getMessage(key)).toBe(message);
    });
  });
});

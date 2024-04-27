import { MessageFormatter } from './message-formatter';

describe('MessageFormatter', () => {
  let messageFormatter: MessageFormatter;

  beforeEach(() => {
    messageFormatter = new MessageFormatter();
  });

  it('should append an argument', () => {
    messageFormatter.appendOrUpdateArgument('arg1', 'value1');
    expect(messageFormatter.formatWithPlaceholders('Message with {arg1}')).toBe('Message with value1');
  });

  it('should append a property name', () => {
    messageFormatter.appendOrUpdatePropertyName('propertyName1');
    expect(messageFormatter.formatWithPlaceholders('Message with {propertyName}')).toBe('Message with propertyName1');
  });

  it('should append a property value', () => {
    messageFormatter.appendOrUpdatePropertyValue('propertyValue1');
    expect(messageFormatter.formatWithPlaceholders('Message with {propertyValue}')).toBe('Message with propertyValue1');
  });

  it('should format message with multiple placeholders', () => {
    messageFormatter.appendOrUpdateArgument('arg1', 'value1');
    messageFormatter.appendOrUpdatePropertyName('propertyName1');
    messageFormatter.appendOrUpdatePropertyValue('propertyValue1');
    expect(messageFormatter.formatWithPlaceholders('Message with {arg1}, {propertyName}, {propertyValue}')).toBe(
      'Message with value1, propertyName1, propertyValue1'
    );
  });

  it('should format message with multiple placeholders in different order', () => {
    messageFormatter.appendOrUpdateArgument('arg1', 'value1');
    messageFormatter.appendOrUpdatePropertyName('propertyName1');
    messageFormatter.appendOrUpdatePropertyValue('propertyValue1');
    expect(messageFormatter.formatWithPlaceholders('Message with {propertyName}, {arg1}, {propertyValue}')).toBe(
      'Message with propertyName1, value1, propertyValue1'
    );
  });

  it('should reset placeholders', () => {
    messageFormatter.appendOrUpdateArgument('arg1', 'value1');
    messageFormatter.appendOrUpdatePropertyName('propertyName1');
    messageFormatter.appendOrUpdatePropertyValue('propertyValue1');
    expect(Object.keys(messageFormatter.placeholders).length).toBe(3);
    messageFormatter.reset();
    expect(Object.keys(messageFormatter.placeholders).length).toBe(0);
    expect(messageFormatter.formatWithPlaceholders('Message with {arg1}, {propertyName}, {propertyValue}')).toBe(
      'Message with {arg1}, {propertyName}, {propertyValue}'
    );
  });
});

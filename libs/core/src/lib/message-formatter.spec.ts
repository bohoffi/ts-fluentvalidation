import { MessageFormatter, createMessageFormatter } from './message-formatter';

describe('MessageFormatter', () => {
  let messageFormatter: MessageFormatter;

  beforeEach(() => {
    messageFormatter = createMessageFormatter();
  });

  it('should append an argument', () => {
    messageFormatter.appendArgument('arg1', 'value1');
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
    messageFormatter.appendArgument('arg1', 'value1');
    messageFormatter.appendOrUpdatePropertyName('propertyName1');
    messageFormatter.appendOrUpdatePropertyValue('propertyValue1');
    expect(messageFormatter.formatWithPlaceholders('Message with {arg1}, {propertyName}, {propertyValue}')).toBe(
      'Message with value1, propertyName1, propertyValue1'
    );
  });
});

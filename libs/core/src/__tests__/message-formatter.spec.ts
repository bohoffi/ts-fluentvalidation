import { formatMessage } from '../lib/functional/validations/message-formatter';

describe(formatMessage.name, () => {
  it('should format a message with placeholders', () => {
    const message = 'Hello, {name}!';
    const placeholders = { name: 'world' };

    const formattedMessage = formatMessage(message, placeholders);

    expect(formattedMessage).toBe('Hello, world!');
  });

  it('should format a message with empty placeholders', () => {
    const message = 'Hello, {name}!';
    const placeholders = {};

    const formattedMessage = formatMessage(message, placeholders);

    expect(formattedMessage).toBe('Hello, {name}!');
  });

  it('should format a message with default placeholders and additional placeholders', () => {
    const message = 'Hello, {name}!';
    const placeholders = { name: 'world', age: 42 };

    const formattedMessage = formatMessage(message, placeholders);

    expect(formattedMessage).toBe('Hello, world!');
  });

  it('should format a message with default placeholders and missing placeholders', () => {
    const message = 'Hello, {name}!';
    const placeholders = { age: 42 };

    const formattedMessage = formatMessage(message, placeholders);

    expect(formattedMessage).toBe('Hello, {name}!');
  });
});

export {};

const mockSend = jest.fn();

jest.mock('@slack/webhook', () => {
  return {
    IncomingWebhook: jest.fn().mockImplementation((url) => {
      return {
        send: async (...args: any) => mockSend(...args),
      };
    }),
  };
});

describe('sendSlackAlert', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };
  });

  it('sends message to slack', async () => {
    process.env.SLACK_WEBHOOK = 'https://example.com';
    process.env.ENVIRONMENT = 'test';

    const { handler } = await import('../../src/handlers/send-slack-alert');

    await handler();

    expect(mockSend).toBeCalledWith({
      text: 'CRN-test: 5xx errors detected at API Gateway',
    });
  });

  it('does not sends message to slack, when webhook url is missing', async () => {
    const { handler } = await import('../../src/handlers/send-slack-alert');

    await handler();

    expect(mockSend).not.toBeCalled();
  });
});

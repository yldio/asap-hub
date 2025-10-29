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

describe('sendSlackAlert (gp2)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // This clears the module cache
    jest.clearAllMocks(); // Clear mock call history
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('sends a message to slack with environment and links', async () => {
    process.env.SLACK_WEBHOOK = 'https://example.com';
    process.env.ENVIRONMENT = 'test';
    process.env.AWS_REGION = 'us-east-1';

    // Import AFTER setting up env vars and AFTER jest.resetModules()
    const { handler } = await import('../../src/handlers/send-slack-alert');
    await handler();

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('does not send message to slack, when webhook url is missing', async () => {
    // Don't set SLACK_WEBHOOK env var
    process.env.SLACK_WEBHOOK = '';
    const { handler } = await import('../../src/handlers/send-slack-alert');
    await handler();

    expect(mockSend).not.toHaveBeenCalled();
  });
});

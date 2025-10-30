export {};

const mockSend = jest.fn();
const mockLogger = {
  warn: jest.fn(),
};

jest.mock('@slack/webhook', () => {
  return {
    IncomingWebhook: jest.fn().mockImplementation((url) => {
      return {
        send: async (...args: any) => mockSend(...args),
      };
    }),
  };
});

jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: mockLogger,
}));

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
    process.env.SLACK_WEBHOOK = 'https://hooks.slack.com/services/TEST/WEBHOOK';
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

  it('throws error when webhook URL is not a valid Slack URL', async () => {
    process.env.SLACK_WEBHOOK = 'https://example.com/webhook';
    process.env.ENVIRONMENT = 'test';
    process.env.AWS_REGION = 'us-east-1';

    const { handler } = await import('../../src/handlers/send-slack-alert');

    await expect(handler()).rejects.toThrow(
      'Invalid SLACK_WEBHOOK configuration: URL must start with \'https://hooks.slack.com/\'',
    );

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('logs and re-throws error when sending to Slack fails', async () => {
    process.env.SLACK_WEBHOOK = 'https://hooks.slack.com/services/TEST/WEBHOOK';
    process.env.ENVIRONMENT = 'test';
    process.env.AWS_REGION = 'us-east-1';

    const sendError = new Error('Network error');
    mockSend.mockRejectedValueOnce(sendError);

    const { handler } = await import('../../src/handlers/send-slack-alert');

    await expect(handler()).rejects.toThrow('Network error');
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Failed to send Slack alert:',
      sendError,
    );
  });
});

import {
  GenerativeContentDataProvider,
  generativeContentDataProviderNoop,
} from '../../src/data-providers/generative-content.data-provider';

const mockedCompletionsCreate = jest.fn();
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: () => mockedCompletionsCreate(),
      },
    },
  })),
}));

describe('GenerativeContentDataProvider', () => {
  const generativeContentDataProvider = new GenerativeContentDataProvider();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('summariseContent', () => {
    it('should use OpenAI completions interface and return the message', async () => {
      mockedCompletionsCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: 'This is a test message',
              role: 'assistant',
            },
          },
        ],
      });

      const result =
        await generativeContentDataProvider.summariseContent('some content');

      expect(result).toEqual('This is a test message');
    });

    it('should allow to exceed the 250 character limit if the result from OpenAI exceeds it', async () => {
      const longMessage = 'a'.repeat(300);
      mockedCompletionsCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: longMessage,
              role: 'assistant',
            },
          },
        ],
      });

      const result =
        await generativeContentDataProvider.summariseContent('some content');

      expect(result).toEqual(longMessage);
      expect(result.length).toBeGreaterThan(250);
    });
  });
});

describe('generativeContentDataProviderNoop', () => {
  it('should always return an empty string', async () => {
    const result =
      await generativeContentDataProviderNoop.summariseContent('some content');

    expect(result).toEqual('');
  });
});

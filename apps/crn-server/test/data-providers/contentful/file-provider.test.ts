import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import FileProvider from '../../../src/data-providers/file-provider';

jest.mock('@aws-sdk/client-lambda');

const mockSend = jest.fn();
(LambdaClient as jest.Mock).mockImplementation(() => ({
  send: mockSend,
}));

describe('FileProvider', () => {
  let provider: FileProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new FileProvider();
  });

  describe('isASCII', () => {
    it('returns true for printable ASCII', () => {
      expect(provider.isASCII('Hello123')).toBe(true);
    });

    it('returns false for non-ASCII', () => {
      expect(provider.isASCII('こんにちは')).toBe(false);
    });
  });

  describe('getPresignedUrl', () => {
    const filename = 'test.png';
    const contentType = 'image/png';

    it('returns uploadUrl on success', async () => {
      const uploadUrl = 'https://example.com/upload';
      const payload = {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
      };

      mockSend.mockResolvedValueOnce({
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      const result = await provider.getPresignedUrl(filename, contentType);
      expect(result).toBe(uploadUrl);
      expect(mockSend).toHaveBeenCalledWith(expect.any(InvokeCommand));
    });

    it('throws if Lambda response is empty', async () => {
      mockSend.mockResolvedValueOnce({});

      await expect(
        provider.getPresignedUrl(filename, contentType),
      ).rejects.toThrow('Lambda returned an empty response');
    });

    it('throws if statusCode is not 200', async () => {
      const payload = {
        statusCode: 500,
        body: JSON.stringify({ error: 'fail' }),
      };
      mockSend.mockResolvedValueOnce({
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      await expect(
        provider.getPresignedUrl(filename, contentType),
      ).rejects.toThrow(/Invalid JSON response from Lambda: /);
    });

    it('throws if body is missing', async () => {
      const payload = {
        statusCode: 200,
      };
      mockSend.mockResolvedValueOnce({
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      await expect(
        provider.getPresignedUrl(filename, contentType),
      ).rejects.toThrow(/Invalid JSON response from Lambda: /);
    });

    it('throws if uploadUrl is missing', async () => {
      const payload = {
        statusCode: 200,
        body: JSON.stringify({}),
      };
      mockSend.mockResolvedValueOnce({
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      await expect(
        provider.getPresignedUrl(filename, contentType),
      ).rejects.toThrow(/Invalid JSON response from Lambda: /);
    });

    it('throws if payload is invalid JSON', async () => {
      mockSend.mockResolvedValueOnce({
        Payload: Buffer.from('INVALID_JSON'),
      });

      await expect(
        provider.getPresignedUrl(filename, contentType),
      ).rejects.toThrow(/Invalid JSON response from Lambda/);
    });
  });
});

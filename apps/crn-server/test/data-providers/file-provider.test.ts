import { LambdaClient } from '@aws-sdk/client-lambda';
import FileProvider from '../../src/data-providers/file-provider';

jest.mock('@aws-sdk/client-lambda');
const sendMock = jest.fn();

(LambdaClient as jest.Mock).mockImplementation(() => ({
  send: sendMock,
}));

describe('FileProvider', () => {
  const provider = new FileProvider();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('parses payload.body directly if it is already an object', async () => {
    const url = 'https://s3-url.com/upload';
    const payload = {
      statusCode: 200,
      body: { uploadUrl: url }, // <--- object, not string
    };

    sendMock.mockResolvedValueOnce({
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const result = await provider.getPresignedUrl(
      'file.pdf',
      'application/pdf',
    );

    expect(result).toBe(url);
  });

  test('falls back to payloadText in error if not ASCII', async () => {
    // Contains a non-ASCII character (e.g., é, λ, etc.)
    const nonAsciiPayload = 'λambda';

    sendMock.mockResolvedValueOnce({
      Payload: Buffer.from(nonAsciiPayload),
    });

    await expect(
      provider.getPresignedUrl('file.pdf', 'application/pdf'),
    ).rejects.toThrow(/Invalid JSON response from Lambda: λambda/);
  });

  test('returns uploadUrl when Lambda returns success', async () => {
    const url = 'https://s3-url.com/upload';
    const payload = {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl: url }),
    };

    sendMock.mockResolvedValueOnce({
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const result = await provider.getPresignedUrl(
      'file.pdf',
      'application/pdf',
    );
    expect(result).toBe(url);
  });

  test('throws if Lambda returns no payload', async () => {
    sendMock.mockResolvedValueOnce({});

    await expect(
      provider.getPresignedUrl('file.pdf', 'application/pdf'),
    ).rejects.toThrow('Lambda returned an empty response');
  });

  test('throws if Lambda returns non-200 status code', async () => {
    sendMock.mockResolvedValueOnce({
      Payload: Buffer.from(JSON.stringify({ statusCode: 500, body: '{}' })),
    });

    await expect(
      provider.getPresignedUrl('file.pdf', 'application/pdf'),
    ).rejects.toThrow('Invalid JSON response from Lambda: ');
  });

  test('throws if Lambda returns invalid JSON', async () => {
    sendMock.mockResolvedValueOnce({
      Payload: Buffer.from('this is not json'),
    });

    await expect(
      provider.getPresignedUrl('file.pdf', 'application/pdf'),
    ).rejects.toThrow('Invalid JSON response from Lambda');
  });

  test('throws if Lambda returns JSON without uploadUrl', async () => {
    const payload = {
      statusCode: 200,
      body: JSON.stringify({}), // no uploadUrl
    };

    sendMock.mockResolvedValueOnce({
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    await expect(
      provider.getPresignedUrl('file.pdf', 'application/pdf'),
    ).rejects.toThrow('Invalid JSON response from Lambda: ');
  });
});

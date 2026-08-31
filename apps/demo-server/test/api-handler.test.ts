import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import { Readable } from 'stream';
import { apiHandler } from '../src/handlers/api-handler';
import { getObject } from '../src/storage';

jest.mock('../src/storage', () => ({
  ...jest.requireActual('../src/storage'),
  getObject: jest.fn(),
}));

const mockGetObject = getObject as jest.MockedFunction<typeof getObject>;

const event = (
  path: string,
  headers: Record<string, string> = {},
): APIGatewayProxyEventV2 =>
  ({
    version: '2.0',
    routeKey: `GET ${path}`,
    rawPath: path,
    rawQueryString: '',
    headers: { host: 'localhost:5555', ...headers },
    requestContext: {
      accountId: '123456789012',
      apiId: 'demo-api',
      domainName: 'localhost',
      domainPrefix: 'localhost',
      http: {
        method: 'GET',
        path,
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: 'jest',
      },
      requestId: 'request-1',
      routeKey: `GET ${path}`,
      stage: '$default',
      time: '01/Jan/2026:00:00:00 +0000',
      timeEpoch: 1767225600000,
    },
    isBase64Encoded: false,
  }) as unknown as APIGatewayProxyEventV2;

const invoke = async (
  path: string,
  headers?: Record<string, string>,
): Promise<APIGatewayProxyStructuredResultV2> =>
  (await apiHandler(
    event(path, headers),
    {} as Context,
  )) as APIGatewayProxyStructuredResultV2;

beforeEach(() => {
  mockGetObject.mockReset();
});

describe('apiHandler', () => {
  it('returns media bytes that are not valid utf8 unchanged', async () => {
    const jpeg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x80,
      0xfe,
    ]);
    mockGetObject.mockResolvedValue({
      body: Readable.from([jpeg]),
      contentLength: jpeg.length,
      contentType: 'image/jpeg',
    });

    const result = await invoke('/media/video-1/sprite.jpg');

    expect(result.statusCode).toBe(200);
    expect(Buffer.from(result.body as string, 'base64')).toEqual(jpeg);
    expect(result.isBase64Encoded).toBe(true);
    expect(result.headers?.['content-length']).toBe(String(jpeg.length));
  });

  it('keeps a 206 and its Content-Range for a ranged media request', async () => {
    const chunk = Buffer.from([0x00, 0x00, 0x00, 0x18, 0xff, 0xc0, 0xff, 0xd9]);
    mockGetObject.mockResolvedValue({
      body: Readable.from([chunk]),
      contentLength: chunk.length,
      contentRange: `bytes 0-7/4096`,
      contentType: 'video/mp4',
    });

    const result = await invoke('/media/video-1/stream.mp4', {
      range: 'bytes=0-7',
    });

    expect(mockGetObject).toHaveBeenCalledWith(
      'media/video-1/stream.mp4',
      'bytes=0-7',
    );
    expect(result.statusCode).toBe(206);
    expect(result.headers?.['content-range']).toBe('bytes 0-7/4096');
    expect(Buffer.from(result.body as string, 'base64')).toEqual(chunk);
    expect(result.isBase64Encoded).toBe(true);
    expect(result.headers?.['content-length']).toBe(String(chunk.length));
  });

  it('leaves a text media object as plain text', async () => {
    mockGetObject.mockResolvedValue({
      body: Readable.from(['WEBVTT\n']),
      contentLength: 7,
      contentType: 'text/vtt',
    });

    const result = await invoke('/media/video-1/thumbnails.vtt');

    expect(result.statusCode).toBe(200);
    expect(result.isBase64Encoded).toBe(false);
    expect(result.body).toBe('WEBVTT\n');
  });

  it('returns an api response as plain json, as it does deployed', async () => {
    const result = await invoke('/api/health');

    expect(result.statusCode).toBe(200);
    expect(result.isBase64Encoded).toBe(false);
    expect(JSON.parse(result.body as string)).toEqual({ status: 'ok' });
  });

  it('returns a not found response as plain json', async () => {
    const result = await invoke('/nothing-here');

    expect(result.statusCode).toBe(404);
    expect(result.isBase64Encoded).toBe(false);
    expect(JSON.parse(result.body as string)).toEqual({ error: 'Not Found' });
  });
});

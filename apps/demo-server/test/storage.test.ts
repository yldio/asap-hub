process.env.SLS_STAGE = 'local';

// BUCKET_NAME is inlined at transform time and is unset here, so the driver
// falls back to the local default bucket name from config.getBucketName()
const bucket = 'demo-hub-local-storage';

/* eslint-disable import/first */
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import {
  abortMultipartUpload,
  completeMultipartUpload,
  createMultipartUpload,
  deletePrefix,
  getObject,
  getS3Client,
  mediaPrefix,
  putObject,
  rawKey,
  setS3Client,
  signUploadParts,
} from '../src/storage';
/* eslint-enable import/first */

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<
  typeof getSignedUrl
>;

const send = jest.fn();

// the driver only ever calls send(); a stub keeps the command inputs inspectable
const stubClient = () => {
  setS3Client({ send } as unknown as S3Client);
};

const lastInput = (call = 0) => send.mock.calls[call]![0].input;

beforeEach(() => {
  send.mockReset().mockResolvedValue({});
  mockGetSignedUrl.mockReset();
  stubClient();
});

afterEach(() => {
  setS3Client(undefined);
});

describe('key helpers', () => {
  it('builds the raw and media keys from the video id', () => {
    expect(rawKey('video-1')).toBe('raw/video-1/original.mp4');
    expect(mediaPrefix('video-1')).toBe('media/video-1/');
  });
});

describe('client configuration', () => {
  afterEach(() => {
    setS3Client(undefined);
  });

  it('points at MinIO with path-style addressing when running locally', async () => {
    setS3Client(undefined);

    const client = getS3Client();

    expect(await client.config.forcePathStyle).toBe(true);
    expect(await client.config.region()).toBe('us-east-1');
    const endpoint = await client.config.endpoint!();
    expect(endpoint.hostname).toBe('localhost');
    expect(endpoint.port).toBe(9000);
    const credentials = await client.config.credentials();
    expect(credentials.accessKeyId).toBe('minioadmin');
    expect(credentials.secretAccessKey).toBe('minioadmin');
  });

  it('reuses the client across calls', () => {
    setS3Client(undefined);
    expect(getS3Client()).toBe(getS3Client());
  });

  it('replaces the client when one is injected', () => {
    const injected = { send } as unknown as S3Client;
    setS3Client(injected);
    expect(getS3Client()).toBe(injected);
  });
});

describe('createMultipartUpload', () => {
  it('creates the upload against the raw key as video/mp4', async () => {
    send.mockResolvedValue({ UploadId: 'upload-1' });

    const result = await createMultipartUpload('video-1');

    expect(result).toEqual({
      uploadId: 'upload-1',
      key: 'raw/video-1/original.mp4',
    });
    expect(lastInput()).toEqual({
      Bucket: bucket,
      Key: 'raw/video-1/original.mp4',
      ContentType: 'video/mp4',
    });
  });

  it('falls back to an empty upload id when S3 omits it', async () => {
    send.mockResolvedValue({});

    await expect(createMultipartUpload('video-1')).resolves.toMatchObject({
      uploadId: '',
    });
  });
});

describe('signUploadParts', () => {
  it('presigns one hour urls for each requested part number', async () => {
    mockGetSignedUrl.mockImplementation(async (_client, command) => {
      const { PartNumber } = (
        command as unknown as { input: Record<string, unknown> }
      ).input;
      return `https://signed.example/part-${PartNumber}`;
    });

    const urls = await signUploadParts('video-1', 'upload-1', [1, 3]);

    expect(urls).toEqual([
      { partNumber: 1, url: 'https://signed.example/part-1' },
      { partNumber: 3, url: 'https://signed.example/part-3' },
    ]);
    expect(mockGetSignedUrl).toHaveBeenCalledTimes(2);
    const [, command, options] = mockGetSignedUrl.mock.calls[0]!;
    expect(
      (command as unknown as { input: Record<string, unknown> }).input,
    ).toEqual({
      Bucket: bucket,
      Key: 'raw/video-1/original.mp4',
      UploadId: 'upload-1',
      PartNumber: 1,
    });
    expect(options).toEqual({ expiresIn: 3600 });
  });
});

describe('completeMultipartUpload', () => {
  it('sorts the parts by number before completing', async () => {
    await completeMultipartUpload('video-1', 'upload-1', [
      { partNumber: 3, eTag: 'c' },
      { partNumber: 1, eTag: 'a' },
      { partNumber: 2, eTag: 'b' },
    ]);

    expect(lastInput()).toEqual({
      Bucket: bucket,
      Key: 'raw/video-1/original.mp4',
      UploadId: 'upload-1',
      MultipartUpload: {
        Parts: [
          { PartNumber: 1, ETag: 'a' },
          { PartNumber: 2, ETag: 'b' },
          { PartNumber: 3, ETag: 'c' },
        ],
      },
    });
  });

  it('does not mutate the parts array it was given', async () => {
    const parts = [
      { partNumber: 2, eTag: 'b' },
      { partNumber: 1, eTag: 'a' },
    ];

    await completeMultipartUpload('video-1', 'upload-1', parts);

    expect(parts[0]!.partNumber).toBe(2);
  });
});

describe('abortMultipartUpload', () => {
  it('aborts the upload for the raw key', async () => {
    await abortMultipartUpload('video-1', 'upload-1');

    expect(lastInput()).toEqual({
      Bucket: bucket,
      Key: 'raw/video-1/original.mp4',
      UploadId: 'upload-1',
    });
  });
});

describe('putObject', () => {
  it('writes the body with the given content type', async () => {
    await putObject('media/video-1/chapters.json', '[]', 'application/json');

    expect(lastInput()).toEqual({
      Bucket: bucket,
      Key: 'media/video-1/chapters.json',
      Body: '[]',
      ContentType: 'application/json',
    });
  });
});

describe('getObject', () => {
  it('passes the range header through and maps the response metadata', async () => {
    const body = Readable.from(['chunk']);
    send.mockResolvedValue({
      Body: body,
      ContentLength: 5,
      ContentRange: 'bytes 0-4/100',
      ContentType: 'video/mp4',
    });

    const result = await getObject('media/video-1/index.m3u8', 'bytes=0-4');

    expect(lastInput()).toEqual({
      Bucket: bucket,
      Key: 'media/video-1/index.m3u8',
      Range: 'bytes=0-4',
    });
    expect(result).toEqual({
      body,
      contentLength: 5,
      contentRange: 'bytes 0-4/100',
      contentType: 'video/mp4',
    });
  });

  it('omits the Range key entirely when no range is requested', async () => {
    send.mockResolvedValue({ Body: Readable.from([]) });

    await getObject('media/video-1/index.m3u8');

    expect(lastInput()).not.toHaveProperty('Range');
  });
});

describe('deletePrefix', () => {
  it('lists then deletes the keys under the prefix', async () => {
    send
      .mockResolvedValueOnce({
        Contents: [
          { Key: 'media/video-1/a.ts' },
          { Key: 'media/video-1/b.ts' },
        ],
        IsTruncated: false,
      })
      .mockResolvedValueOnce({});

    await deletePrefix('media/video-1/');

    expect(lastInput(0)).toEqual({
      Bucket: bucket,
      Prefix: 'media/video-1/',
      ContinuationToken: undefined,
    });
    expect(lastInput(1)).toEqual({
      Bucket: bucket,
      Delete: {
        Objects: [{ Key: 'media/video-1/a.ts' }, { Key: 'media/video-1/b.ts' }],
      },
    });
  });

  it('follows the continuation token until the listing is exhausted', async () => {
    send
      .mockResolvedValueOnce({
        Contents: [{ Key: 'media/video-1/page-1' }],
        IsTruncated: true,
        NextContinuationToken: 'token-1',
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        Contents: [{ Key: 'media/video-1/page-2' }],
        IsTruncated: false,
      })
      .mockResolvedValueOnce({});

    await deletePrefix('media/video-1/');

    expect(send).toHaveBeenCalledTimes(4);
    expect(lastInput(2).ContinuationToken).toBe('token-1');
    expect(lastInput(3).Delete.Objects).toEqual([
      { Key: 'media/video-1/page-2' },
    ]);
  });

  it('skips the delete call when the prefix is empty', async () => {
    send.mockResolvedValueOnce({ Contents: [], IsTruncated: false });

    await deletePrefix('media/video-1/');

    expect(send).toHaveBeenCalledTimes(1);
  });

  it('ignores listed entries without a key', async () => {
    send
      .mockResolvedValueOnce({
        Contents: [{ Key: undefined }, { Key: 'media/video-1/a.ts' }],
        IsTruncated: false,
      })
      .mockResolvedValueOnce({});

    await deletePrefix('media/video-1/');

    expect(lastInput(1).Delete.Objects).toEqual([
      { Key: 'media/video-1/a.ts' },
    ]);
  });

  it('stops when S3 reports truncation without a next token', async () => {
    send
      .mockResolvedValueOnce({
        Contents: [{ Key: 'media/video-1/a.ts' }],
        IsTruncated: true,
        NextContinuationToken: undefined,
      })
      .mockResolvedValueOnce({});

    await deletePrefix('media/video-1/');

    expect(send).toHaveBeenCalledTimes(2);
  });
});

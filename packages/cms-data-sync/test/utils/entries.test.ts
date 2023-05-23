import { Environment } from 'contentful-management';
import { RateLimiter } from 'limiter';
import {
  checkIfEntryAlreadyExistsInContentful,
  clearContentfulEntries,
  publishContentfulEntries,
} from '../../src/utils';
import { getEntry, newsEntry } from '../fixtures';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';

describe('checkIfEntryAlreadyExistsInContentful', () => {
  let envMock: Environment;

  const consoleLogRef = console.log;

  beforeEach(async () => {
    console.log = jest.fn();
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  it('outputs correct value when entry does not exist on contentful', async () => {
    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getEntry')
      .mockRejectedValueOnce(contenfulErrorResponse);

    expect(
      await checkIfEntryAlreadyExistsInContentful(envMock, 'entryId'),
    ).toEqual(false);
  });

  it('outputs correct value when entry exists on contentful', async () => {
    const entry = getEntry({ url: 'http://vimeo.com/video' });

    jest.spyOn(envMock, 'getEntry').mockResolvedValueOnce(entry);

    expect(
      await checkIfEntryAlreadyExistsInContentful(envMock, 'entryId'),
    ).toEqual(true);
  });

  it('rejects when contentful response is not successful', async () => {
    jest.spyOn(envMock, 'getEntry').mockRejectedValueOnce('error');

    await expect(
      checkIfEntryAlreadyExistsInContentful(envMock, 'entryId'),
    ).rejects.toEqual('error');
  });
});

describe('clearContentfulEntries', () => {
  let envMock: Environment;

  const consoleLogRef = console.log;

  beforeEach(async () => {
    console.log = jest.fn();
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
    jest.spyOn(envMock, 'getEntries').mockResolvedValueOnce({
      total: 1,
      items: [newsEntry],
      skip: 0,
      limit: 10,
      toPlainObject: jest.fn(),
      sys: { type: 'Array' },
    });
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  it('calls getEntries with the given contentModel', async () => {
    await clearContentfulEntries(envMock, 'news', {
      removeTokens: jest.fn(),
    } as unknown as RateLimiter);

    expect(envMock.getEntries).toHaveBeenCalledWith({
      content_type: 'news',
      limit: 100,
      skip: 0,
    });
  });

  it('gets more pages of entries if total is more than page size', async () => {
    envMock.getEntries.mockReset();
    jest.spyOn(envMock, 'getEntries').mockResolvedValue({
      total: 250,
      items: Array.from(100).fill(newsEntry),
      skip: 0,
      limit: 100,
      toPlainObject: jest.fn(),
      sys: { type: 'Array' },
    });
    await clearContentfulEntries(envMock, 'news', {
      removeTokens: jest.fn(),
    } as unknown as RateLimiter);

    expect(envMock.getEntries).toHaveBeenCalledWith({
      content_type: 'news',
      limit: 100,
      skip: 0,
    });
    expect(envMock.getEntries).toHaveBeenCalledWith({
      content_type: 'news',
      limit: 100,
      skip: 100,
    });
    expect(envMock.getEntries).toHaveBeenCalledWith({
      content_type: 'news',
      limit: 100,
      skip: 200,
    });
  });

  describe('verifies if entry is publish', () => {
    it('and calls unpublish if entry is published', async () => {
      jest.spyOn(newsEntry, 'isPublished').mockImplementationOnce(() => true);

      await clearContentfulEntries(envMock, 'news', {
        removeTokens: jest.fn(),
      } as unknown as RateLimiter);

      expect(newsEntry.isPublished).toHaveBeenCalledTimes(1);
      expect(newsEntry.unpublish).toHaveBeenCalledTimes(1);
    });

    it('and does not call unpublish if entry is not published', async () => {
      jest.spyOn(newsEntry, 'isPublished').mockImplementationOnce(() => false);

      await clearContentfulEntries(envMock, 'news', {
        removeTokens: jest.fn(),
      } as unknown as RateLimiter);

      expect(newsEntry.isPublished).toHaveBeenCalledTimes(1);
      expect(newsEntry.unpublish).not.toHaveBeenCalled();
    });

    it('calls delete', async () => {
      await clearContentfulEntries(envMock, 'news', {
        removeTokens: jest.fn(),
      } as unknown as RateLimiter);
      expect(newsEntry.delete).toHaveBeenCalledTimes(1);
    });
  });
});

describe('publishContentfulEntries', () => {
  const consoleLogRef = console.log;

  beforeEach(async () => {
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  it('calls entry publish function', async () => {
    await publishContentfulEntries([newsEntry], {
      removeTokens: jest.fn(),
    } as unknown as RateLimiter);
    expect(newsEntry.publish).toHaveBeenCalledTimes(1);
  });

  it('outputs a message when publish fails', async () => {
    await publishContentfulEntries([newsEntry], {
      removeTokens: jest.fn(),
    } as unknown as RateLimiter);
    expect(console.log).toHaveBeenCalledWith(
      '\x1b[31m',
      `[ERROR] Entry with ID ${newsEntry.sys.id} could not be published.`,
    );
  });

  it('outputs a message when publish is successful', async () => {
    jest
      .spyOn(newsEntry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(newsEntry));
    await publishContentfulEntries([newsEntry], {
      removeTokens: jest.fn(),
    } as unknown as RateLimiter);
    expect(console.log).toHaveBeenCalledWith(
      '\x1b[32m',
      expect.stringContaining(`[INFO] Published entry ${newsEntry.sys.id}.`),
    );
  });
});

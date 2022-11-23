import { Environment } from 'contentful-management';
import {
  clearContentfulEntries,
  publishContentfulEntries,
} from '../../src/utils';
import { newsEntry, getContentfulEnvironmentMock } from '../fixtures';

describe('clearContentfulEntries', () => {
  let envMock: Environment;

  beforeEach(async () => {
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

  it('calls getEntries with the given contentModel', async () => {
    await clearContentfulEntries(envMock, 'news');

    expect(envMock.getEntries).toHaveBeenCalledWith({ content_type: 'news' });
  });

  describe('verifies if entry is publish', () => {
    it('and calls unpublish if entry is published', async () => {
      jest.spyOn(newsEntry, 'isPublished').mockImplementationOnce(() => true);

      await clearContentfulEntries(envMock, 'news');

      expect(newsEntry.isPublished).toHaveBeenCalledTimes(1);
      expect(newsEntry.unpublish).toHaveBeenCalledTimes(1);
    });

    it('and does not call unpublish if entry is not published', async () => {
      jest.spyOn(newsEntry, 'isPublished').mockImplementationOnce(() => false);

      await clearContentfulEntries(envMock, 'news');

      expect(newsEntry.isPublished).toHaveBeenCalledTimes(1);
      expect(newsEntry.unpublish).not.toHaveBeenCalled();
    });

    it('calls delete', async () => {
      await clearContentfulEntries(envMock, 'news');
      expect(newsEntry.delete).toHaveBeenCalledTimes(1);
    });
  });
});

describe('publishContentfulEntries', () => {
  console.log = jest.fn();

  it('calls entry publish function', async () => {
    await publishContentfulEntries([newsEntry]);
    expect(newsEntry.publish).toHaveBeenCalledTimes(1);
  });

  it('outputs a message when publish fails', async () => {
    await publishContentfulEntries([newsEntry]);
    expect(console.log).toHaveBeenCalledWith(
      `Entry with id ${newsEntry.sys.id} could not be published.`,
    );
  });

  it('outputs a message when publish is successful', async () => {
    jest
      .spyOn(newsEntry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(newsEntry));
    await publishContentfulEntries([newsEntry]);
    expect(console.log).toHaveBeenCalledWith(
      `Published entry ${newsEntry.sys.id}.`,
    );
  });
});

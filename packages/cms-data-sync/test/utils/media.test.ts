import { Environment } from 'contentful-management';
import { createMediaEntries } from '../../src/utils';
import { getEntry } from '../fixtures';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';

describe('createMediaEntries', () => {
  let envMock: Environment;

  const consoleLogRef = console.log;

  beforeEach(async () => {
    jest.clearAllMocks();
    console.log = jest.fn();

    envMock = getContentfulEnvironmentMock();
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  const mediaId = 'videoId';
  const mediaURL = 'http://vimeo.com/video';
  const mediaPayload = {
    fields: {
      url: {
        'en-US': mediaURL,
      },
    },
  };

  it('creates media when it does exist on contentful yet', async () => {
    const entry = getEntry({ url: mediaURL });

    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getEntry')
      .mockRejectedValueOnce(contenfulErrorResponse);

    jest.spyOn(envMock, 'createEntryWithId').mockResolvedValueOnce(entry);

    await createMediaEntries(envMock, [[mediaId, mediaPayload]]);

    expect(envMock.createEntryWithId).toHaveBeenCalledWith(
      'media',
      mediaId,
      mediaPayload,
    );

    expect(entry.publish).toHaveBeenCalled();
  });

  it('does not create media when it already exists on contentful', async () => {
    const entry = getEntry({ url: mediaURL });

    jest.spyOn(envMock, 'getEntry').mockResolvedValueOnce(entry);

    await createMediaEntries(envMock, [[mediaId, mediaPayload]]);

    expect(envMock.createEntryWithId).not.toHaveBeenCalled();
    expect(entry.publish).not.toHaveBeenCalled();
  });
});

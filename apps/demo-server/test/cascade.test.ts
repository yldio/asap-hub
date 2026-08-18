process.env.SLS_STAGE = 'local';

/* eslint-disable import/first */
import { videoEntity } from '../src/data/entities';
import { deleteVideoCascade } from '../src/routes/cascade';
import { deletePrefix } from '../src/storage';
/* eslint-enable import/first */

jest.mock('../src/storage', () => ({
  ...jest.requireActual('../src/storage'),
  deletePrefix: jest.fn(),
}));

const mockDeletePrefix = deletePrefix as jest.MockedFunction<
  typeof deletePrefix
>;

const mockItemDelete = () =>
  jest
    .spyOn(videoEntity, 'delete')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue({ go: async () => ({ data: {} }) } as any);

beforeEach(() => {
  jest.restoreAllMocks();
  mockDeletePrefix.mockReset().mockResolvedValue(undefined);
});

describe('deleteVideoCascade', () => {
  it('clears both the raw and the media prefixes, then the item', async () => {
    const remove = mockItemDelete();

    await deleteVideoCascade('video-1');

    expect(mockDeletePrefix).toHaveBeenCalledTimes(2);
    expect(mockDeletePrefix).toHaveBeenCalledWith('raw/video-1/');
    expect(mockDeletePrefix).toHaveBeenCalledWith('media/video-1/');
    expect(remove).toHaveBeenCalledWith({ id: 'video-1' });
  });

  it('still deletes the item when one prefix fails, and attempts both', async () => {
    const remove = mockItemDelete();
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockDeletePrefix.mockImplementation(async (prefix) => {
      if (prefix === 'raw/video-1/') {
        throw new Error('AccessDenied');
      }
    });

    await expect(deleteVideoCascade('video-1')).resolves.toBeUndefined();

    expect(mockDeletePrefix).toHaveBeenCalledWith('raw/video-1/');
    expect(mockDeletePrefix).toHaveBeenCalledWith('media/video-1/');
    expect(remove).toHaveBeenCalledWith({ id: 'video-1' });
    expect(error).toHaveBeenCalledWith(
      'failed to delete raw/video-1/',
      expect.any(Error),
    );
  });

  it('deletes the item even when both prefixes fail', async () => {
    const remove = mockItemDelete();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockDeletePrefix.mockRejectedValue(new Error('AccessDenied'));

    await expect(deleteVideoCascade('video-1')).resolves.toBeUndefined();

    expect(remove).toHaveBeenCalledWith({ id: 'video-1' });
  });

  it('propagates a failure to delete the item itself', async () => {
    jest.spyOn(videoEntity, 'delete').mockReturnValue({
      go: async () => {
        throw new Error('ThrottlingException');
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await expect(deleteVideoCascade('video-1')).rejects.toThrow(
      'ThrottlingException',
    );
  });
});

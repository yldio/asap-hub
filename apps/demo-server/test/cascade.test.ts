process.env.SLS_STAGE = 'local';
process.env.TABLE_NAME = 'demo-hub-test-data';
process.env.BUCKET_NAME = 'demo-hub-test-storage';

/* eslint-disable import/first */
import { assetEntity, videoEntity } from '../src/data/entities';
import { deleteVideoCascade } from '../src/routes/cascade';
import { abortMultipartUploadsUnder, deletePrefix } from '../src/storage';
/* eslint-enable import/first */

jest.mock('../src/storage', () => ({
  ...jest.requireActual('../src/storage'),
  deletePrefix: jest.fn(),
  abortMultipartUploadsUnder: jest.fn(),
}));

const mockDeletePrefix = deletePrefix as jest.MockedFunction<
  typeof deletePrefix
>;

const mockAbortUploads = abortMultipartUploadsUnder as jest.MockedFunction<
  typeof abortMultipartUploadsUnder
>;

const mockItemDelete = () =>
  jest
    .spyOn(videoEntity, 'delete')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue({ go: async () => ({ data: {} }) } as any);

const mockAssets = (assetIds: string[] = []) => {
  jest.spyOn(assetEntity.query, 'byVideo').mockReturnValue({
    go: async () => ({ data: assetIds.map((assetId) => ({ assetId })) }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return (
    jest
      .spyOn(assetEntity, 'delete')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockReturnValue({ go: async () => ({ data: {} }) } as any)
  );
};

beforeEach(() => {
  jest.restoreAllMocks();
  mockDeletePrefix.mockReset().mockResolvedValue(undefined);
  mockAbortUploads.mockReset().mockResolvedValue(undefined);
  mockAssets();
});

describe('deleteVideoCascade', () => {
  it('clears the raw, media and project prefixes, then the item', async () => {
    const remove = mockItemDelete();

    await deleteVideoCascade('video-1');

    expect(mockDeletePrefix).toHaveBeenCalledTimes(3);
    expect(mockDeletePrefix).toHaveBeenCalledWith('raw/video-1/');
    expect(mockDeletePrefix).toHaveBeenCalledWith('media/video-1/');
    expect(mockDeletePrefix).toHaveBeenCalledWith('projects/video-1/');
    expect(remove).toHaveBeenCalledWith({ id: 'video-1' });
  });

  it('deletes every asset row of the project', async () => {
    mockItemDelete();
    const removeAsset = mockAssets(['asset-1', 'asset-2']);

    await deleteVideoCascade('video-1');

    expect(removeAsset).toHaveBeenCalledWith({
      videoId: 'video-1',
      assetId: 'asset-1',
    });
    expect(removeAsset).toHaveBeenCalledWith({
      videoId: 'video-1',
      assetId: 'asset-2',
    });
  });

  it('still deletes the item when the assets cannot be listed', async () => {
    const remove = mockItemDelete();
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    jest.spyOn(assetEntity.query, 'byVideo').mockReturnValue({
      go: async () => {
        throw new Error('ThrottlingException');
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await expect(deleteVideoCascade('video-1')).resolves.toBeUndefined();

    expect(remove).toHaveBeenCalledWith({ id: 'video-1' });
    expect(error).toHaveBeenCalledWith(
      'failed to delete the assets of video-1',
      expect.any(Error),
    );
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

describe('deleteVideoCascade in-flight uploads', () => {
  it('aborts the uploads still open on the raw and project prefixes', async () => {
    mockItemDelete();

    await deleteVideoCascade('video-1');

    expect(mockAbortUploads).toHaveBeenCalledWith('raw/video-1/');
    expect(mockAbortUploads).toHaveBeenCalledWith('projects/video-1/');
  });

  it('aborts before the objects are deleted, so a late part cannot survive', async () => {
    mockItemDelete();
    const order: string[] = [];
    mockAbortUploads.mockImplementation(async () => {
      order.push('abort');
    });
    mockDeletePrefix.mockImplementation(async () => {
      order.push('delete');
    });

    await deleteVideoCascade('video-1');

    expect(order[0]).toBe('abort');
  });

  it('still deletes the objects and the item when the abort fails', async () => {
    const remove = mockItemDelete();
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockAbortUploads.mockRejectedValue(new Error('AccessDenied'));

    await expect(deleteVideoCascade('video-1')).resolves.toBeUndefined();

    expect(mockDeletePrefix).toHaveBeenCalledWith('raw/video-1/');
    expect(mockDeletePrefix).toHaveBeenCalledWith('media/video-1/');
    expect(remove).toHaveBeenCalledWith({ id: 'video-1' });
    expect(error).toHaveBeenCalledWith(
      'failed to abort uploads under raw/video-1/',
      expect.any(Error),
    );
  });
});

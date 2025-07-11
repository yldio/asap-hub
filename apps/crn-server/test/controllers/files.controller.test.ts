import FilesController from '../../src/controllers/files.controller';
import FileProvider from '../../src/data-providers/file-provider';

describe('FilesController', () => {
  const mockGetPresignedUrl = jest.fn();
  const mockFileProvider = {
    getPresignedUrl: mockGetPresignedUrl,
  } as unknown as FileProvider;

  const controller = new FilesController(mockFileProvider);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls fileProvider.getPresignedUrl with the correct arguments and returns its result', async () => {
    const filename = 'example.pdf';
    const contentType = 'application/pdf';
    const action = 'upload';
    const expectedUrl = 'https://s3-presigned-url.com';

    mockGetPresignedUrl.mockResolvedValueOnce(expectedUrl);

    const result = await controller.getPresignedUrl(
      filename,
      'upload',
      contentType,
    );

    expect(mockGetPresignedUrl).toHaveBeenCalledWith(
      filename,
      action,
      contentType,
    );
    expect(result).toBe(expectedUrl);
  });
});

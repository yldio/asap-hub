import FileProvider from '../data-providers/file-provider';

export default class FilesController {
  constructor(private fileProvider: FileProvider) {}

  async getPresignedUrl(
    filename: string,
    action: 'download' | 'upload' = 'upload',
    contentType?: string,
  ): Promise<string> {
    return this.fileProvider.getPresignedUrl(filename, action, contentType);
  }
}

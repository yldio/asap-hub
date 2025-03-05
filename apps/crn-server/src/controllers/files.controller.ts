import FileProvider from '../data-providers/file-provider';

export default class FilesController {
  constructor(private fileProvider: FileProvider) {}

  async getPresignedUrl(
    filename: string,
    contentType: string,
  ): Promise<string> {
    return this.fileProvider.getPresignedUrl(filename, contentType);
  }
}

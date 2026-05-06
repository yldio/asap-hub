import { EntryDataProvider } from '../data-providers/types';

export default class EntryController {
  constructor(private entryProvider: EntryDataProvider) {}

  async getChangedFields(entryId: string): Promise<string[]> {
    return this.entryProvider.getChangedFields(entryId);
  }
}

import { Environment } from '@asap-hub/contentful';
import { ListResponse } from '@asap-hub/model';
import { EntryDataProvider } from '../types';

export class EntryContentfulDataProvider implements EntryDataProvider {
  constructor(private getRestClient: () => Promise<Environment>) {}

  async fetch(): Promise<ListResponse<null>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async getChangedFields(entryId: string): Promise<string[]> {
    const env = await this.getRestClient();

    const entry = await env.getEntry(entryId);

    if (!entry.sys.publishedVersion || entry.sys.publishedVersion < 2) {
      return [];
    }

    const snapshots = await env.getEntrySnapshots(entryId);
    const prevSnapshot = snapshots.items[1];

    if (!prevSnapshot) return [];

    const locale = 'en-US';

    const currentFields = entry.fields;
    const prevFields = prevSnapshot?.snapshot?.fields ?? {};

    const changedFields = [];

    const fieldKeys = new Set([
      ...Object.keys(currentFields || {}),
      ...Object.keys(prevFields || {}),
    ]);

    for (const key of fieldKeys) {
      const currentValue = currentFields[key]?.[locale];
      const prevValue = prevFields[key]?.[locale];

      if (JSON.stringify(currentValue) !== JSON.stringify(prevValue)) {
        changedFields.push(key);
      }
    }

    return changedFields;
  }
}

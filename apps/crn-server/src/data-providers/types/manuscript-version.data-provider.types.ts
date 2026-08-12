import { ManuscriptVersionRecord } from '@asap-hub/algolia';
import { ManuscriptsFilter } from '@asap-hub/contentful';
import {
  DataProvider,
  FetchOptions,
  ListManuscriptVersionExportResponse,
  ManuscriptVersionDataObject,
} from '@asap-hub/model';

export type ManuscriptVersionRecordDataObject = Omit<
  ManuscriptVersionDataObject,
  'latestManuscriptVersion'
> & {
  latestManuscriptVersion?: ManuscriptVersionRecord;
};

export type ManuscriptVersionDataProvider = DataProvider<
  ManuscriptVersionRecordDataObject,
  ManuscriptVersionRecord,
  FetchOptions<ManuscriptsFilter>
> & {
  fetchComplianceManuscriptVersions: (
    options: FetchOptions<string[]>,
  ) => Promise<ListManuscriptVersionExportResponse>;
  fetchManuscriptVersionIdsByLinkedEntry: (
    entryId: string,
    entryType: string,
  ) => Promise<string[]>;
};

import { ManuscriptsFilter } from '@asap-hub/contentful';
import {
  DataProvider,
  FetchOptions,
  ListManuscriptVersionExportResponse,
  ManuscriptVersionDataObject,
  ManuscriptVersionResponse,
} from '@asap-hub/model';

export type ManuscriptVersionDataProvider = DataProvider<
  ManuscriptVersionDataObject,
  ManuscriptVersionResponse,
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

import { ManuscriptsFilter } from '@asap-hub/contentful';
import {
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  DataProvider,
  ManuscriptUpdateDataObject,
  ManuscriptResubmitDataObject,
  FetchOptions,
  PartialManuscriptResponse,
} from '@asap-hub/model';

export type ManuscriptDataProvider = Omit<
  DataProvider<
    ManuscriptDataObject,
    PartialManuscriptResponse,
    FetchOptions<ManuscriptsFilter>,
    ManuscriptCreateDataObject
  >,
  'fetchById'
> & {
  update(
    id: string,
    data: ManuscriptUpdateDataObject,
    userId: string,
  ): Promise<void>;
  createVersion: (
    id: string,
    input: ManuscriptResubmitDataObject,
  ) => Promise<void>;
  fetchById(id: string, userId: string): Promise<ManuscriptDataObject | null>;
};

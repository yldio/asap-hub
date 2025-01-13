import {
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  DataProvider,
  ManuscriptUpdateDataObject,
  ManuscriptResubmitDataObject,
  FetchOptions,
  PartialManuscriptResponse,
} from '@asap-hub/model';

export type ManuscriptDataProvider = DataProvider<
  ManuscriptDataObject,
  PartialManuscriptResponse,
  FetchOptions,
  ManuscriptCreateDataObject
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
};

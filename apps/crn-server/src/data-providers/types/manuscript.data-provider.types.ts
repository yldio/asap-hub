import {
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  DataProvider,
  ManuscriptUpdateDataObject,
  ManuscriptResubmitDataObject,
} from '@asap-hub/model';

export type ManuscriptDataProvider = DataProvider<
  ManuscriptDataObject,
  ManuscriptDataObject,
  null,
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

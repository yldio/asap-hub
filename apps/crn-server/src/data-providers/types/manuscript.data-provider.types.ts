import {
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  DataProvider,
  ManuscriptUpdateDataObject,
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
};

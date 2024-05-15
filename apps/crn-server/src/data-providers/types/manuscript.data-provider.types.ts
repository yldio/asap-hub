import {
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  DataProvider,
} from '@asap-hub/model';

export type ManuscriptDataProvider = DataProvider<
  ManuscriptDataObject,
  ManuscriptDataObject,
  null,
  ManuscriptCreateDataObject
>;

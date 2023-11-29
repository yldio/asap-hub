import {
  DataProvider,
  ExternalAuthorCreateDataObject,
  ExternalAuthorDataObject,
  FetchOptions,
} from '@asap-hub/model';

export type ExternalAuthorDataProvider = DataProvider<
  ExternalAuthorDataObject,
  ExternalAuthorDataObject,
  FetchOptions,
  ExternalAuthorCreateDataObject
>;

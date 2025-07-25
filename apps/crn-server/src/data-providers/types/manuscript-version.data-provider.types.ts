import { ManuscriptsFilter } from '@asap-hub/contentful';
import {
  DataProvider,
  FetchOptions,
  ManuscriptVersionDataObject,
  ManuscriptVersionResponse,
} from '@asap-hub/model';

export type ManuscriptVersionDataProvider = DataProvider<
  ManuscriptVersionDataObject,
  ManuscriptVersionResponse,
  FetchOptions<ManuscriptsFilter>
>;

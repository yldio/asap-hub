import {
  TutorialsDataObject,
  DataProvider,
  FetchOptions,
} from '@asap-hub/model';

export type TutorialDataProvider = DataProvider<
  TutorialsDataObject,
  TutorialsDataObject,
  FetchOptions
>;

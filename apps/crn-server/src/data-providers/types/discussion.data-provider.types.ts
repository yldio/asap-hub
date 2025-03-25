import {
  DiscussionDataObject,
  DataProvider,
  DiscussionUpdateDataObject,
  DiscussionCreateDataObject,
} from '@asap-hub/model';

export type DiscussionDataProvider = DataProvider<
  DiscussionDataObject,
  DiscussionDataObject,
  null,
  DiscussionCreateDataObject,
  null,
  DiscussionUpdateDataObject
>;

import {
  DiscussionDataObject,
  DataProvider,
  DiscussionUpdateDataObject,
  MessageCreateDataObject,
} from '@asap-hub/model';

export type DiscussionDataProvider = DataProvider<
  DiscussionDataObject,
  DiscussionDataObject,
  null,
  MessageCreateDataObject,
  null,
  DiscussionUpdateDataObject
>;

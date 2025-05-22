import { UserResponse } from './user';

type DiscussionUser = Pick<
  UserResponse,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'displayName'
  | 'avatarUrl'
  | 'alumniSinceDate'
> & {
  teams: { id: string; name: string }[];
};

export type Message = {
  text: string;
  createdDate: string;
  createdBy: DiscussionUser;
};

export type DiscussionDataObject = {
  id: string;
  message: Message;
  replies?: Message[];
};

export type Reply = { text: string; isOpenScienceMember: boolean };

export type DiscussionUpdateDataObject = {
  userId: string;
  reply?: Reply;
  manuscriptId?: string;
  notificationList?: string;
};

export type DiscussionRequest = {
  text: string;
  manuscriptId: string;
  notificationList?: string;
};

export type DiscussionEndRequest = {
  endedBy: string;
};

export type DiscussionCreateRequest = {
  manuscriptId: string;
  title: string;
  text: string;
  notificationList?: string;
};

export type DiscussionCreateDataObject = DiscussionCreateRequest & {
  userId: string;
};

export type DiscussionResponse = DiscussionDataObject;

export type ManuscriptDiscussion = {
  id: string;
  title: string;
  createdBy: DiscussionUser;
  createdDate: string;
  lastUpdatedAt: string;
  text: string;
  replies: Message[];
  read: boolean;
};

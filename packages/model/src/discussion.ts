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

export type MessageCreateDataObject = {
  text: string;
  userId: string;
};

export type DiscussionUpdateDataObject = {
  reply?: MessageCreateDataObject & { isOpenScienceMember: boolean };
  manuscriptId: string;
  sendNotifications: boolean;
  notificationList: string;
};

export type DiscussionRequest = {
  text: string;
  manuscriptId: string;
  sendNotifications?: boolean;
  notificationList?: string;
};

export type DiscussionEndRequest = {
  endedBy: string;
};

export type DiscussionCreateRequest = {
  manuscriptId: string;
  title: string;
  text: string;
  sendNotifications?: boolean;
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
};

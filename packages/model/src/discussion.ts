import { ManuscriptFileResponse } from './manuscript';
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
  files?: ManuscriptFileResponse[];
  createdDate: string;
  createdBy: DiscussionUser;
};

export type DiscussionDataObject = {
  id: string;
  message: Message;
  replies?: Message[];
};

export type Reply = {
  text: string;
  isOpenScienceMember: boolean;
  files?: ManuscriptFileResponse[];
};

export type WorkspaceType = 'team' | 'project';

export type DiscussionUpdateDataObject = {
  userId: string;
  reply?: Reply;
  manuscriptId?: string;
  notificationList?: string;
  workspaceType?: WorkspaceType;
};

export type DiscussionRequest = {
  text: string;
  files?: ManuscriptFileResponse[];
  manuscriptId: string;
  notificationList?: string;
  workspaceType?: WorkspaceType;
};

export type DiscussionEndRequest = {
  endedBy: string;
};

export type DiscussionCreateRequest = {
  manuscriptId: string;
  title: string;
  text: string;
  files?: ManuscriptFileResponse[];
  notificationList?: string;
  workspaceType?: WorkspaceType;
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
  files?: ManuscriptFileResponse[];
  replies: Message[];
  read: boolean;
};

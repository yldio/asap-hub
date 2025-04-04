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

export type DiscussionType = 'compliance-report' | '';

export type MessageCreateDataObject = {
  text: string;
  userId: string;
  complianceReportId?: string;
  type?: DiscussionType;
};

export type DiscussionUpdateDataObject = {
  reply?: MessageCreateDataObject;
  endedBy?: string;
};

export type DiscussionRequest = {
  text: string;
};

export type DiscussionEndRequest = {
  endedBy: string;
};

export type DiscussionCreateRequest = {
  manuscriptId: string;
  title: string;
  text: string;
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

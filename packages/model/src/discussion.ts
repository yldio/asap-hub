import { UserResponse } from './user';

export type Message = {
  text: string;
  createdDate: string;
  createdBy: Pick<
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
  reply: MessageCreateDataObject;
};

export type DiscussionRequest = {
  text: string;
};

export type DiscussionCreateRequest = {
  message: string;
  id: string;
  type: DiscussionType;
};

export type DiscussionResponse = DiscussionDataObject;

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

export type MessageCreateDataObject = {
  text: string;
  userId: string;
};

export type DiscussionUpdateDataObject = {
  reply: MessageCreateDataObject;
};

export type DiscussionPatchRequest = {
  replyText: string;
};

export type DiscussionResponse = DiscussionDataObject;

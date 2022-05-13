import {
  UserResponse,
  ExternalAuthorResponse,
  EventSpeakerUser,
} from '@asap-hub/model';

export const isInternalUser = (
  author: ExternalAuthorResponse | UserResponse,
): author is UserResponse => (author as UserResponse).email !== undefined;

export const isInternalEventUser = (
  user: EventSpeakerUser | undefined,
): user is EventSpeakerUser => {
  if (user?.displayName) return true;
  return false;
};

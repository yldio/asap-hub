import {
  UserResponse,
  ExternalAuthorResponse,
  EventSpeakerUserData,
} from '@asap-hub/model';

export const isInternalUser = (
  author: ExternalAuthorResponse | UserResponse,
): author is UserResponse => (author as UserResponse).email !== undefined;

export const isInternalEventUser = (
  user: EventSpeakerUserData | undefined,
): user is EventSpeakerUserData => {
  if (user?.displayName) return true;
  return false;
};

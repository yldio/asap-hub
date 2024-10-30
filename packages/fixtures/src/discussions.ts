import { DiscussionResponse, Message } from '@asap-hub/model';
import { manuscriptAuthor } from './manuscripts';

export const createMessage = (text: string = 'test message'): Message => ({
  text,
  createdDate: '2020-12-10T20:36:54Z',
  createdBy: { ...manuscriptAuthor },
});

export const createDiscussionResponse = (
  message: string = 'test message',
  replies: Message[] = [],
  itemIndex = 0,
): DiscussionResponse => ({
  id: `t${itemIndex}`,
  message: createMessage(message),
  replies,
});

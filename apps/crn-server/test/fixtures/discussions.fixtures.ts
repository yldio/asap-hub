import { FetchDiscussionByIdQuery } from '@asap-hub/contentful';
import { manuscriptAuthor } from '@asap-hub/fixtures';
import {
  DiscussionDataObject,
  Message,
  MessageCreateDataObject,
} from '@asap-hub/model';

export const getMessage = (text?: string): Message => ({
  text: text ?? 'test message',
  createdDate: '2020-11-26T11:56:04.000Z',
  createdBy: manuscriptAuthor,
});

export const getDiscussionDataObject = (): DiscussionDataObject => ({
  id: 'discussion-id-1',
  message: getMessage(),
  replies: [getMessage('test reply')],
});

export const getDiscussionCreateDataObject = (): MessageCreateDataObject => ({
  text: 'test message',
  userId: 'user-id-0',
});

const getContentfulGraphqlCreatedBy = () => ({
  sys: {
    id: manuscriptAuthor.id,
  },
  firstName: manuscriptAuthor.firstName,
  lastName: manuscriptAuthor.lastName,
  nickname: 'Tim',
  alumniSinceDate: manuscriptAuthor.alumniSinceDate,
  avatar: { url: manuscriptAuthor.avatarUrl },
  teamsCollection: {
    items: [
      {
        team: {
          sys: {
            id: manuscriptAuthor.teams[0]!.id,
          },
          displayName: manuscriptAuthor.teams[0]!.name,
        },
      },
    ],
  },
});

export const getContentfulGraphqlDiscussion =
  (): NonNullable<FetchDiscussionByIdQuery>['discussions'] => ({
    sys: {
      id: 'discussion-id-1',
    },
    message: {
      sys: {
        publishedAt: '2020-11-26T11:56:04.000Z',
      },
      text: 'test message',
      createdBy: getContentfulGraphqlCreatedBy(),
    },
    repliesCollection: {
      items: [
        {
          sys: {
            publishedAt: '2020-11-26T11:56:04.000Z',
          },
          text: 'test reply',
          createdBy: getContentfulGraphqlCreatedBy(),
        },
      ],
    },
  });

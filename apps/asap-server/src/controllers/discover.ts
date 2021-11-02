import { GraphqlPage, GraphqlNews, GraphqlUser } from '@asap-hub/squidex';
import { DiscoverResponse } from '@asap-hub/model';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import {
  parseGraphQLUser,
  parseGraphQLPage,
  parseGraphQLNews,
} from '../entities';
import { FetchUserQuery } from '../gql/graphql';

export const query = `
{
    queryDiscoverContents {
      flatData {
        aboutUs
        training {
          id
          created
          flatData {
            type
            shortText
            text
            title
            link
            linkText
            thumbnail {
              id
            }
          }
        }
        pages {
          id
          created
          flatData {
            shortText
            text
            title
            link
            linkText
          }
        }
        members {
          id
          created
          flatData {
            avatar {
              id
            }
            email
            firstName
            institution
            jobTitle
            lastModifiedDate
            lastName
          }
        }
      }
    }
  }
`;

export interface SquidexDiscoverResponse {
  queryDiscoverContents: {
    flatData: {
      aboutUs: string;
      training: GraphqlNews[];
      members: GraphqlUser[];
      pages: GraphqlPage[];
    };
  }[];
}

export default class Discover implements DiscoverController {
  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
  }

  async fetch(): Promise<DiscoverResponse> {
    const res = await this.client.request<SquidexDiscoverResponse, unknown>(
      query,
    );
    if (res.queryDiscoverContents.length === 0) {
      return {
        aboutUs: '',
        training: [],
        members: [],
        pages: [],
      };
    }

    const [content] = res.queryDiscoverContents;
    return {
      aboutUs: content.flatData.aboutUs || '',
      training: content.flatData.training?.map(parseGraphQLNews) ?? [],
      members:
        content.flatData.members?.map((member) =>
          parseGraphQLUser(
            // @todo remove the cast https://trello.com/c/5vW6YMsL/1694-replace-graphql-types-with-the-generated-ones-news
            member as NonNullable<FetchUserQuery['findUsersContent']>,
          ),
        ) ?? [],
      pages: content.flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}

export interface DiscoverController {
  fetch: () => Promise<DiscoverResponse>;
}

import {
  SquidexGraphql,
  GraphqlPage,
  GraphqlNewsOrEvent,
  GraphqlUser,
} from '@asap-hub/squidex';
import { DiscoverResponse } from '@asap-hub/model';
import {
  parseGraphQLUser,
  parseGraphQLPage,
  parseGraphQLNewsAndEvents,
} from '../entities';

export const buildGraphQLDiscoverQuery = (top = 8, skip = 0): string => `{
    queryDiscoverContents (top: ${top}, skip: ${skip}) {
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
  }  `;

interface Response {
  queryDiscoverContents: {
    flatData: {
      aboutUs: string;
      training: GraphqlNewsOrEvent[];
      members: GraphqlUser[];
      pages: GraphqlPage[];
    };
  }[];
}

export default class Discover {
  client: SquidexGraphql;

  constructor() {
    this.client = new SquidexGraphql();
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<DiscoverResponse> {
    const { take, skip } = options;
    const query = buildGraphQLDiscoverQuery(take, skip);
    const res = await this.client.request<Response, unknown>(query);
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
      training: content.flatData.training?.map(parseGraphQLNewsAndEvents) ?? [],
      members: content.flatData.members?.map(parseGraphQLUser) ?? [],
      pages: content.flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}

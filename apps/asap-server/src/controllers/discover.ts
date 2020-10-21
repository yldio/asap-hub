import { GraphQL } from '@asap-hub/services-common';
import { DiscoverResponse } from '@asap-hub/model';
import {
  CMSGraphQLUser,
  parseGraphQL as parseGraphQLUser,
} from '../entities/user';
import {
  CMSGraphQLPage,
  parseGraphQL as parseGraphQLPage,
} from '../entities/page';

export const query = `
{
    queryDiscoverContents {
      flatData {
        aboutUs
        pages {
          id
          flatData {
            text
            title
          }
        }
        members {
          id
          created
          flatData {
            avatar {
              id
            }
            displayName
            email
            firstName
            lastModifiedDate
            lastName
          }
        }  
      }
    }
  }  
`;

interface Response {
  queryDiscoverContents: {
    flatData: {
      aboutUs: string;
      members: CMSGraphQLUser[];
      pages: CMSGraphQLPage[];
    };
  }[];
}

export default class Discover {
  client: GraphQL;

  constructor() {
    this.client = new GraphQL();
  }

  async fetch(): Promise<DiscoverResponse> {
    const res = await this.client.request<Response, unknown>(query);
    if (res.queryDiscoverContents.length === 0) {
      return {
        aboutUs: '',
        members: [],
        pages: [],
      };
    }

    const [content] = res.queryDiscoverContents;
    return {
      aboutUs: content.flatData.aboutUs || '',
      members: content.flatData.members?.map(parseGraphQLUser) ?? [],
      pages: content.flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}

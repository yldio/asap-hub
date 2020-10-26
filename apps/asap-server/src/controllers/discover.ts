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

import {
  CMSGraphQLNewsAndEvents,
  parseGraphQL as parseGraphQLNewsAndEvents,
} from '../entities/news-and-events';

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
            displayName
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

interface Response {
  queryDiscoverContents: {
    flatData: {
      aboutUs: string;
      training: CMSGraphQLNewsAndEvents[];
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

import {
  GraphqlPage,
  GraphqlNewsOrEvent,
  GraphqlUser,
} from '@asap-hub/squidex';
import { DiscoverResponse } from '@asap-hub/model';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import {
  parseGraphQLUser,
  parseGraphQLPage,
  parseGraphQLNewsAndEvents,
} from '../entities';

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
      training: GraphqlNewsOrEvent[];
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
      training: content.flatData.training?.map(parseGraphQLNewsAndEvents) ?? [],
      members: content.flatData.members?.map(parseGraphQLUser) ?? [],
      pages: content.flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}

export interface DiscoverController {
  fetch: () => Promise<DiscoverResponse>;
}

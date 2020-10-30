import {
  SquidexGraphql,
  GraphqlPage,
  GraphqlNewsOrEvent,
} from '@asap-hub/squidex';
import { DashboardResponse } from '@asap-hub/model';
import { parseGraphQLPage, parseGraphQLNewsAndEvents } from '../entities';

export const query = `
  {
    queryDashboardContents {
      flatData {
        news {
          id
          created
          flatData {
            title 
            shortText 
            text 
            type 
            thumbnail {
              id
            }
            link 
            linkText 
          }
        }
        pages {
          id
          created
          flatData {
            path
            title
            shortText
            text
            link
            linkText
          }
        }
      }
    }
  }
`;

interface Response {
  queryDashboardContents: {
    flatData: {
      news?: GraphqlNewsOrEvent[];
      pages?: GraphqlPage[];
    };
  }[];
}

export default class Dashboard {
  client: SquidexGraphql;

  constructor() {
    this.client = new SquidexGraphql();
  }

  async fetch(): Promise<DashboardResponse> {
    const res = await this.client.request<Response, unknown>(query);
    if (res.queryDashboardContents.length === 0) {
      return {
        newsAndEvents: [],
        pages: [],
      };
    }

    return {
      newsAndEvents:
        res.queryDashboardContents[0].flatData.news?.map(
          parseGraphQLNewsAndEvents,
        ) ?? [],
      pages:
        res.queryDashboardContents[0].flatData.pages?.map(parseGraphQLPage) ??
        [],
    };
  }
}

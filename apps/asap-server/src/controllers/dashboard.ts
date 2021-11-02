import { GraphqlPage, GraphqlNews } from '@asap-hub/squidex';
import { DashboardResponse } from '@asap-hub/model';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import { parseGraphQLPage, parseGraphQLNews } from '../entities';

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
      news?: GraphqlNews[];
      pages?: GraphqlPage[];
    };
  }[];
}

export interface DashboardController {
  fetch: () => Promise<DashboardResponse>;
}

export default class Dashboard {
  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
  }

  async fetch(): Promise<DashboardResponse> {
    const res = await this.client.request<Response, unknown>(query);
    if (res.queryDashboardContents.length === 0) {
      return {
        news: [],
        pages: [],
      };
    }

    return {
      news:
        res.queryDashboardContents[0].flatData.news?.map(parseGraphQLNews) ??
        [],
      pages:
        res.queryDashboardContents[0].flatData.pages?.map(parseGraphQLPage) ??
        [],
    };
  }
}

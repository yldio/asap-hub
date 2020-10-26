import { GraphQL } from '@asap-hub/services-common';
import { DashboardResponse } from '@asap-hub/model';
import {
  CMSNewsAndEvents,
  parseNewsAndEvents,
  CMSPage,
  parsePage,
} from '../entities';

export const query = `
  {
    queryDashboardContents {
      data {
        news {
          iv {
            id
            created
            data {
              title {
                iv
              }
              shortText {
                iv
              }
              text {
                iv
              }
              type {
                iv
              }
              thumbnail {
                iv {
                  id
                }
              }
              link {
                iv
              }
              linkText {
                iv
              }
            }
          }
        }
        pages {
          iv {
            id
            created
            data {
              path {
                iv
              }
              title {
                iv
              }
              shortText {
                iv
              }
              text {
                iv
              }
              link {
                iv
              }
              linkText {
                iv
              }
            }
          }
        }
      }
    }
  }
`;

interface Response {
  queryDashboardContents: {
    data: {
      news: {
        iv: CMSNewsAndEvents[];
      };
      pages: {
        iv: CMSPage[];
      };
    };
  }[];
}

export default class Dashboard {
  client: GraphQL;

  constructor() {
    this.client = new GraphQL();
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
        res.queryDashboardContents[0].data.news?.iv.map(parseNewsAndEvents) ??
        [],
      pages: res.queryDashboardContents[0].data.pages?.iv.map(parsePage) ?? [],
    };
  }
}

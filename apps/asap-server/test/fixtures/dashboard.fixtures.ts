import { DashboardResponse } from '@asap-hub/model';
import { config } from "@asap-hub/squidex";

export const dashboardResponse: DashboardResponse = {
  newsAndEvents: [
    {
      id: 'news-and-events-1',
      title: 'News 1',
      type: 'News',
      shortText: 'Short text of news 1',
      text: '<p>text</p>',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/thumbnail-uuid1`,
      created: '2020-09-08T16:35:28.000Z',
    },
    {
      id: 'news-and-events-2',
      title: 'Event 2',
      type: 'Event',
      shortText: 'Short text of event 2',
      text: '<p>text</p>',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/thumbnail-uuid2`,
      created: '2020-09-16T14:31:19.000Z',
    },
  ],
  pages: [],
};

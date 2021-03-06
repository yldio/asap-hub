import { config, RestNewsOrEvent } from '@asap-hub/squidex';
import { ListNewsAndEventsResponse } from '@asap-hub/model';

export const newsAndEventsSquidexApiResponse: {
  total: number;
  items: RestNewsOrEvent[];
} = {
  total: 2,
  items: [
    {
      id: 'news-and-events-1',
      data: {
        title: {
          iv: 'News 1',
        },
        type: {
          iv: 'News',
        },
        shortText: {
          iv: 'Short text of news 1',
        },
        text: {
          iv: '<p>text</p>',
        },
        thumbnail: {
          iv: ['thumbnail-uuid1'],
        },
      },
      lastModified: '2020-09-25T09:42:51Z',
      created: '2020-09-08T16:35:28Z',
    },
    {
      id: 'news-and-events-2',
      data: {
        title: {
          iv: 'Event 2',
        },
        type: {
          iv: 'Event',
        },
        shortText: {
          iv: 'Short text of event 2',
        },
        text: {
          iv: '<p>text</p>',
        },
        thumbnail: {
          iv: ['thumbnail-uuid2'],
        },
      },
      lastModified: '2020-09-25T09:42:51Z',
      created: '2020-09-16T14:31:19Z',
    },
  ],
};

export const listNewsAndEventsResponse: ListNewsAndEventsResponse = {
  total: 2,
  items: [
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
};

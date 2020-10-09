import { ListNewsAndEventsResponse } from '@asap-hub/model';
import { cms } from '../../../src/config';
import { CMSNewsAndEvents } from '../../../src/entities/news-and-events';

export const newsAndEventsResponse: {
  total: number;
  items: CMSNewsAndEvents[];
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
        subtitle: {
          iv: 'Subtitle of news 1',
        },
        text: {
          iv: '<p>text</p>',
        },
        thumbnail: {
          iv: ['thumbnail-uuid1'],
        },
      },
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
        subtitle: {
          iv: 'Subtitle of event 2',
        },
        text: {
          iv: '<p>text</p>',
        },
        thumbnail: {
          iv: ['thumbnail-uuid2'],
        },
      },
      created: '2020-09-16T14:31:19Z',
    },
  ],
};

export const expectation: ListNewsAndEventsResponse = {
  total: 2,
  items: [
    {
      id: 'news-and-events-1',
      title: 'News 1',
      type: 'News',
      subtitle: 'Subtitle of news 1',
      text: '<p>text</p>',
      thumbnail: `${cms.baseUrl}/api/assets/${cms.appName}/thumbnail-uuid1`,
      created: new Date('2020-09-08T16:35:28.000Z'),
    },
    {
      id: 'news-and-events-2',
      title: 'Event 2',
      type: 'Event',
      subtitle: 'Subtitle of event 2',
      text: '<p>text</p>',
      thumbnail: `${cms.baseUrl}/api/assets/${cms.appName}/thumbnail-uuid2`,
      created: new Date('2020-09-16T14:31:19.000Z'),
    },
  ],
};

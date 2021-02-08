// import { ListEventsResponse } from '@asap-hub/model';
import { ResponseFetchEvents } from '../../src/controllers/events';

export const fetchEventsResponse: { data: ResponseFetchEvents } = {
  data: {
    queryEventsContentsWithTotal: {
      total: 2,
      items: [
        {
          id: 'afcee0ec-fcd5-479c-9809-e397636f815a',
          created: '2021-02-08T16:04:56Z',
          lastModified: '2021-02-08T16:22:12Z',
          flatData: {
            description: 'This event is awesome',
            endDate: '2009-12-24T16:20:14Z',
            startDate: '2009-12-02T16:19:31Z',
            meetingLink: 'https://zoom.com/room/123',
            eventLink: 'https://example.com/event/123',
            status: 'confirmed',
            tags: [],
            title: 'Example Event',
            calendar: [
              {
                id: 'd7e3181a-f9d3-4f0c-bc77-5f17c722d93e',
                created: '2021-01-14T16:38:40Z',
                lastModified: '2021-01-14T16:38:40Z',
                flatData: {
                  id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
                  color: '#125A12',
                  name: 'Tech 1 - Sequencing/omics',
                },
              },
            ],
          },
        },
        {
          id: 'a820b5b7-8f7a-4297-a5a5-cf48b53ba3f7',
          created: '2021-02-08T16:10:08Z',
          lastModified: '2021-02-08T16:20:35Z',
          flatData: {
            description: null,
            endDate: '2021-02-08T16:20:32Z',
            startDate: '2021-02-08T16:20:32Z',
            meetingLink: null,
            eventLink: null,
            status: null,
            tags: [],
            title: 'This is another event',
            calendar: [
              {
                id: 'fff13135-711a-4478-a3b3-0a97fed7bffc',
                created: '2021-01-14T16:39:17Z',
                lastModified: '2021-01-14T16:39:17Z',
                flatData: {
                  id: 'c_v8ma9lsbsjf90rk30ougr54iig@group.calendar.google.com',
                  color: '#7A367A',
                  name: 'Tech 3 - Structural Biology',
                },
              },
            ],
          },
        },
      ],
    },
  },
};

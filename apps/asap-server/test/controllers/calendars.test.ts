import nock from 'nock';
import Calendars from '../../src/controllers/calendars';
import { identity } from '../helpers/squidex';
import { config, Results, RestCalendar } from '@asap-hub/squidex';

describe('Dashboard controller', () => {
  const calendars = new Calendars();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result when the no calendars are found', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 50,
            skip: 0,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
          }),
        })
        .reply(200, { total: 0, items: [] });

      const result = await calendars.fetch({ take: 50, skip: 0 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the the calendars', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/calendars`)
        .query({
          q: JSON.stringify({
            take: 20,
            skip: 10,
            sort: [{ path: 'data.name.iv', order: 'ascending' }],
          }),
        })
        .reply(200, getCalendarsResponse);

      const result = await calendars.fetch({ take: 20, skip: 10 });

      expect(result).toEqual({
        total: 2,
        items: [
          {
            id: 'calendar-id-1',
            color: '#5C1158',
            name: 'Kubernetes Meetups',
          },
          {
            id: 'calendar-id-2',
            color: '#B1365F',
            name: 'Service Mesh Conferences',
          },
        ],
      });
    });
  });
});

const getCalendarsResponse: Results<RestCalendar> = {
  total: 2,
  items: [
    {
      id: 'cms-calendar-id-1',
      data: {
        id: { iv: 'calendar-id-1' },
        color: { iv: '#5C1158' },
        name: { iv: 'Kubernetes Meetups' },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
    },
    {
      id: 'cms-calendar-id-2',
      data: {
        id: { iv: 'calendar-id-2' },
        color: { iv: '#B1365F' },
        name: { iv: 'Service Mesh Conferences' },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
    },
  ],
};

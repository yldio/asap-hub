import { NotFoundError } from '@asap-hub/errors';
import Events from '../../src/controllers/events.controller';
import {
  getEventDataObject,
  getEventResponse,
  getListEventDataObject,
  getListEventResponse,
} from '../fixtures/events.fixtures';
import { identity } from '../helpers/squidex';

import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Event controller', () => {
  const eventDataProviderMock = getDataProviderMock();
  const eventController = new Events(eventDataProviderMock);

  beforeAll(() => identity());
  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe('Fetch method', () => {
    test('it should fetch the events', async () => {
      eventDataProviderMock.fetch.mockResolvedValue(getListEventDataObject());
      const result = await eventController.fetch({});

      expect(result).toEqual(getListEventResponse());
    });
    test('Should return empty list when there are no events', async () => {
      eventDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await eventController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('Fetch by id method', () => {
    test('Should throw when event is not found', async () => {
      eventDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(eventController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });
    test('Should return the event when it finds it', async () => {
      eventDataProviderMock.fetchById.mockResolvedValue(getEventDataObject());
      const result = await eventController.fetchById('project-id');

      expect(result).toEqual(getEventResponse());
    });
  });
  describe('Create method', () => {
    test('Should return the newly created event', async () => {
      const googleId = 'a-google-id';
      const calendar = 'a-squidex-calendar';
      const hidden = false;
      const {
        title,
        description,
        startDate,
        startDateTimeZone,
        endDate,
        endDateTimeZone,
        status,
        tags,
        hideMeetingLink,
      } = getEventDataObject();

      eventDataProviderMock.fetchById.mockResolvedValue(getEventDataObject());
      const result = await eventController.create({
        description,
        title,
        startDate,
        startDateTimeZone,
        endDate,
        endDateTimeZone,
        status,
        tags,
        hideMeetingLink,
        googleId,
        calendar,
        hidden,
      });

      expect(result).toEqual(getEventResponse());
      expect(eventDataProviderMock.create).toHaveBeenCalledWith({
        description,
        title,
        startDate,
        startDateTimeZone,
        endDate,
        endDateTimeZone,
        status,
        tags,
        hideMeetingLink,
        googleId,
        calendar,
        hidden,
      });
    });
  });

  describe('Update method', () => {
    test('Should return the newly updated event', async () => {
      const event = getEventDataObject();
      const { calendar: _, ...eventUpdate } = event;
      eventDataProviderMock.fetchById.mockResolvedValue(event);
      const result = await eventController.update('7', eventUpdate);

      expect(result).toEqual(getEventResponse());
      expect(eventDataProviderMock.update).toHaveBeenCalledWith(
        '7',
        eventUpdate,
      );
    });
  });

  describe('fetchByGoogleId method', () => {
    const googleId = 'google-event-id';
    test('it should fetch the events', async () => {
      eventDataProviderMock.fetch.mockResolvedValue(getListEventDataObject());
      const result = await eventController.fetchByGoogleId(googleId);

      expect(eventDataProviderMock.fetch).toHaveBeenCalledWith({
        filter: { googleId, hidden: true },
        take: 1,
      });
      expect(result).toEqual(getEventResponse());
    });
    test('it should return null if no events found', async () => {
      eventDataProviderMock.fetch.mockResolvedValue({ total: 0, items: [] });
      const result = await eventController.fetchByGoogleId(googleId);

      expect(eventDataProviderMock.fetch).toHaveBeenCalledWith({
        filter: { googleId, hidden: true },
        take: 1,
      });
      expect(result).toEqual(null);
    });
  });
});

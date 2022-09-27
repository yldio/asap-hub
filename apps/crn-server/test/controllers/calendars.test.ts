import { NotFoundError } from '@asap-hub/errors';
import Calendars from '../../src/controllers/calendars';
import {
  getCalendarResponse,
  getListCalendarResponse,
  getCalendarDataObject,
} from '../fixtures/calendars.fixtures';
import { calendarDataProviderMock } from '../mocks/calendar-data-provider.mock';
import { CalendarUpdateRequest } from '@asap-hub/model';

describe('Calendars Controller', () => {
  const calendarsController = new Calendars(calendarDataProviderMock);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the calendars', async () => {
      calendarDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getCalendarDataObject()],
      });
      const result = await calendarsController.fetch({});

      expect(result).toMatchObject(getListCalendarResponse());
    });

    test('Should an empty list when there are no calendars', async () => {
      calendarDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await calendarsController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      calendarDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [getCalendarDataObject()],
      });
      await calendarsController.fetch({ skip: 13, take: 9 });

      expect(calendarDataProviderMock.fetch).toBeCalledWith({
        skip: 13,
        take: 9,
      });
    });
  });

  describe('FetchById method', () => {
    test('Should throw when the calendar is not found', async () => {
      calendarDataProviderMock.fetchById.mockResolvedValue(null);

      await expect(calendarsController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the calendar when it finds it', async () => {
      calendarDataProviderMock.fetchById.mockResolvedValue(
        getCalendarDataObject(),
      );
      const result = await calendarsController.fetchById('calendar-id');

      expect(result).toEqual(getCalendarResponse());
    });
  });

  describe('Update method', () => {
    test('Should return the updated calendar', async () => {
      calendarDataProviderMock.fetchById.mockResolvedValue(
        getCalendarDataObject(),
      );

      const result = await calendarsController.update('calendar-id', {
        expirationDate: 928349328,
      });

      expect(result).toEqual(getCalendarResponse());
    });

    test('Should call the data provider with correct input', async () => {
      calendarDataProviderMock.fetchById.mockResolvedValue(
        getCalendarDataObject(),
      );

      const input: CalendarUpdateRequest = {
        expirationDate: 928349823,
        resourceId: 'resource-id',
      };
      await calendarsController.update('calendar-id', input);

      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
        'calendar-id',
        input,
      );
    });
  });
});

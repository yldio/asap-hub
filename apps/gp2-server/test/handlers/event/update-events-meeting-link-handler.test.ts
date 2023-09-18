import { when } from 'jest-when';

import {
  getCommonGoogleId,
  meetingLinkUpdateHandler,
} from '../../../src/handlers/event/update-events-meeting-link-handler';
import { getEventEvent, getEventResponse } from '../../fixtures/event.fixtures';
import { eventControllerMock } from '../../mocks/event.controller.mock';
import { loggerMock } from '../../mocks/logger.mock';

describe('getCommonGoogleId', () => {
  test('works when it receives a series googleId event', () => {
    expect(
      getCommonGoogleId('65h0vfns41nlt7ra26los68kl2_20230920T133000Z'),
    ).toEqual('65h0vfns41nlt7ra26los68kl2');
  });

  test('works when it receives a non series googleId event', () => {
    expect(getCommonGoogleId('65h0vfns41nlt7ra26los68kl2')).toEqual(
      '65h0vfns41nlt7ra26los68kl2',
    );
  });

  test('works when it receives an empty string', () => {
    expect(getCommonGoogleId('')).toEqual('');
  });
});

describe('Meeting Link Update Handler', () => {
  const handler = meetingLinkUpdateHandler(eventControllerMock, loggerMock);

  afterEach(() => jest.clearAllMocks());

  test('updates series events when there are events with common google ids', async () => {
    const seriesEvent1 = getEventResponse();
    seriesEvent1.id = 'event-series-1';
    seriesEvent1.googleId = 'googleId_1';
    seriesEvent1.meetingLink = 'https://zoom.com/shared-link';
    seriesEvent1.copyMeetingLink = true;

    const seriesEvent2 = getEventResponse();
    seriesEvent2.id = 'event-series-2';
    seriesEvent2.googleId = 'googleId_2';
    seriesEvent2.meetingLink = undefined;

    const seriesEvent3 = getEventResponse();
    seriesEvent3.id = 'event-series-3';
    seriesEvent3.googleId = 'googleId_3';
    seriesEvent3.meetingLink = undefined;

    eventControllerMock.fetchById.mockResolvedValueOnce(seriesEvent1);
    eventControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [seriesEvent1, seriesEvent2, seriesEvent3],
    });

    const webhookEvent = getEventEvent(seriesEvent1.id, 'EventsPublished');

    await handler(webhookEvent);

    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(seriesEvent1.id);
    expect(eventControllerMock.fetch).toHaveBeenCalledWith({
      filter: { googleId: 'googleId' },
    });

    expect(eventControllerMock.update).toHaveBeenNthCalledWith(
      1,
      'event-series-2',
      { meetingLink: 'https://zoom.com/shared-link', copyMeetingLink: false },
    );
    expect(eventControllerMock.update).toHaveBeenNthCalledWith(
      2,
      'event-series-3',
      { meetingLink: 'https://zoom.com/shared-link', copyMeetingLink: false },
    );
  });

  test('does not update series events when there are not other events with common google ids', async () => {
    const seriesEvent1 = getEventResponse();
    seriesEvent1.id = 'event-series-1';
    seriesEvent1.googleId = 'googleId_1';
    seriesEvent1.meetingLink = 'https://zoom.com/shared-link';
    seriesEvent1.copyMeetingLink = true;

    eventControllerMock.fetchById.mockResolvedValueOnce(seriesEvent1);
    eventControllerMock.fetch.mockResolvedValueOnce({
      total: 1,
      items: [seriesEvent1],
    });

    const webhookEvent = getEventEvent(seriesEvent1.id, 'EventsPublished');

    await handler(webhookEvent);

    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(seriesEvent1.id);
    expect(eventControllerMock.fetch).toHaveBeenCalledWith({
      filter: { googleId: 'googleId' },
    });
    expect(eventControllerMock.update).not.toHaveBeenCalled();
  });

  test('does not update series events when copyMeetingLink is false', async () => {
    const seriesEvent1 = getEventResponse();
    seriesEvent1.id = 'event-series-1';
    seriesEvent1.googleId = 'googleId_1';
    seriesEvent1.meetingLink = 'https://zoom.com/shared-link';
    seriesEvent1.copyMeetingLink = false;

    const seriesEvent2 = getEventResponse();
    seriesEvent2.id = 'event-series-2';
    seriesEvent2.googleId = 'googleId_2';
    seriesEvent2.meetingLink = undefined;

    const seriesEvent3 = getEventResponse();
    seriesEvent3.id = 'event-series-3';
    seriesEvent3.googleId = 'googleId_3';
    seriesEvent3.meetingLink = undefined;

    eventControllerMock.fetchById.mockResolvedValueOnce(seriesEvent1);
    eventControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [seriesEvent1, seriesEvent2, seriesEvent3],
    });

    const webhookEvent = getEventEvent(seriesEvent1.id, 'EventsPublished');

    await handler(webhookEvent);

    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(seriesEvent1.id);

    expect(eventControllerMock.fetch).not.toHaveBeenCalled();
    expect(eventControllerMock.update).not.toHaveBeenCalled();
  });

  test('throws without sending update request if fetch event by id does not return a value', async () => {
    const webhookEvent = getEventEvent('event-1', 'EventsPublished');
    eventControllerMock.fetchById.mockRejectedValueOnce(new Error('error'));

    await expect(handler(webhookEvent)).rejects.toThrow();

    expect(eventControllerMock.update).not.toHaveBeenCalled();
  });

  test('logs error if series event is not updated successfully', async () => {
    const seriesEvent1 = getEventResponse();
    seriesEvent1.id = 'event-series-1';
    seriesEvent1.googleId = 'googleId_1';
    seriesEvent1.meetingLink = 'https://zoom.com/shared-link';
    seriesEvent1.copyMeetingLink = true;

    const seriesEvent2 = getEventResponse();
    seriesEvent2.id = 'event-series-2';
    seriesEvent2.googleId = 'googleId_2';
    seriesEvent2.meetingLink = undefined;

    const seriesEvent3 = getEventResponse();
    seriesEvent3.id = 'event-series-3';
    seriesEvent3.googleId = 'googleId_3';
    seriesEvent3.meetingLink = undefined;

    eventControllerMock.fetchById.mockResolvedValueOnce(seriesEvent1);
    eventControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [seriesEvent1, seriesEvent2, seriesEvent3],
    });

    when(eventControllerMock.update)
      .calledWith('event-series-2', {
        meetingLink: 'https://zoom.com/shared-link',
        copyMeetingLink: false,
      })
      .mockResolvedValueOnce(getEventResponse());

    when(eventControllerMock.update)
      .calledWith('event-series-3', {
        meetingLink: 'https://zoom.com/shared-link',
        copyMeetingLink: false,
      })
      .mockRejectedValueOnce(new Error('unknown error'));

    const webhookEvent = getEventEvent(seriesEvent1.id, 'EventsPublished');

    await handler(webhookEvent);

    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(seriesEvent1.id);
    expect(eventControllerMock.fetch).toHaveBeenCalledWith({
      filter: { googleId: 'googleId' },
    });

    expect(eventControllerMock.update).toHaveBeenNthCalledWith(
      1,
      'event-series-2',
      { meetingLink: 'https://zoom.com/shared-link', copyMeetingLink: false },
    );

    expect(loggerMock.error).toHaveBeenCalledWith(
      'Error updating event event-series-3: Error: unknown error',
    );
  });
});

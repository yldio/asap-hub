import { APIGatewayProxyResult } from 'aws-lambda';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';

import {
  SubscribeToEventChanges,
  webhookCalendarCreatedHandlerFactory,
} from '../../../src/handlers/webhooks/webhook-calendar-created';
import { apiGatewayEvent } from '../../helpers/events';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import { createCalendarEvent } from './webhook-sync-calendar.fixtures';

const createSignedPayload = (payload: WebhookPayload<Calendar>) =>
  apiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });

describe('Calendar Created Webhook', () => {
  describe('Validation', () => {
    const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();

    const handler = webhookCalendarCreatedHandlerFactory(subscribe);

    afterEach(() => {
      subscribe.mockClear();
    });

    test('Should return 204 and not subscribe when the event type is not implemented', async () => {
      const res = (await handler(
        createSignedPayload({
          ...createCalendarEvent,
          type: 'notImplemented',
        }),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(204);
      expect(subscribe).not.toHaveBeenCalled();
    });

    test('Should return 200 and subscribe with the calendar ID when the type is valid', async () => {
      const res = (await handler(
        createSignedPayload(createCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(subscribe).toHaveBeenCalledWith(
        createCalendarEvent.payload.data.id.iv,
        createCalendarEvent.payload.id,
      );
    });
  });

  // describe('Subscription', () => {
  //   const calendarId = 'calendar-id';
  //   const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  //   const jwtCreds: JWTInput = {
  //     type: 'service_account',
  //     project_id: 'project-id',
  //     private_key_id: 'private_key_id',
  //     private_key:
  //       '-----BEGIN PRIVATE KEY-----\nMIICWwIBAAKBgQDJpnoWExjMFj+MAHLr7y0sVmLhQAP/jmG1kbsYM/TTEv+GcsCP\ns63xJuHFM+cnmmvH6guz0tLxrxJPQYdFxWAjFmndx0DocR/DyZM+oil9fY4O0k9O\nciRgho6u/Pe7DpojNhkBWDSyoqbzmUDq2+3oTpCX66vjqT4L7HJQXGBzCQIDAQAB\nAoGAIxOaWQypW5bjJu9NDk1khjngqV4BVAroZDUdXnBrPewoFrMPW+/daf1heHQ2\n2WS7KuNDddxOZUwW20KCzVgwCJsJuWcsYgewjduh6yxlxUOxu2c8TOUiZnwM+2O4\nu9QRIZ4McjQvNUeNEbXcgWEmoH4GZtMqhFSxK3pF+985gqECQQD6eVq0JC11Hr77\nxW8pqi6YzPwfxvjumn8wlWy9sov7roWQBU1uMAWC2zBORZBWJrknZdiJM3r1RL1P\nF6mf5+zfAkEAzhlfTeg+717ZxhWEakioU3DKRu3sNQw5ZhByMporA4nwTkWju0cd\nEs733UGdC53T92e4KdnKRS+8qYmU1YA1FwJASj1n/hbvBlTrpLJ7ZW0UzKONY1nV\ndNuEMYFIrt1aEmpDGlIIBk3jhEq1ga2qv25Q2PWd/eStYD9UoTnRRB05HwJANVA4\n6BVQ2mjl2qjMRRYgfN0rZie7t4k++9j7QX3B7Lts70JydUqTCb+CPLjxYATmxRQO\nfrz45ubPXefaGVR95wJAdycZY4gswQGKEyxzBflFB7mopAKVg2MIVUkH4TVWOBpt\nBCZ61qMSBOSGP2llPoAuUOHHvgTmXwDswYO4Jlp+4Q==\n-----END PRIVATE KEY-----\n',
  //     client_email: 'client_email',
  //     client_id: 'client_id',
  //   };
  //   const subscribeToEventChanges = subscribeToEventChangesFactory(
  //     getJWTCredentials,
  //   );

  //   test('Should subscribe to the calendar events notifications', async () => {
  //     getJWTCredentials.mockResolvedValueOnce(jwtCreds);

  //     nock(googleApiUrl)
  //       .post(
  //         `/calendar/v3/calendars/${calendarId}@group.calendar.google.com/events/watch`,
  //       )
  //       .reply(200, {});

  //     await subscribeToEventChanges(calendarId);

  //     expect(nock.isDone()).toBe(true);
  //   });
  // });
});

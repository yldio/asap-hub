export {};
describe('test', () => {
  test.todo('comment back in');
});
// import { APIGatewayProxyResult } from 'aws-lambda';
// import { EventBridge } from 'aws-sdk';
// import { squidexWebhookFactory } from '../../../src/handlers/webhooks/webhook-squidex';
// import { getLabWebhookPayload } from '../../fixtures/labs.fixtures';
// import { createSignedPayload } from '../../helpers/webhooks';
// import { getApiGatewayEvent } from '../../helpers/events';
// import { eventBus, eventSource } from '../../../src/config';

// describe('Squidex event webhook', () => {
//   const evenBridgeMock = {
//     putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
//   } as unknown as jest.Mocked<EventBridge>;
//   const handler = squidexWebhookFactory(evenBridgeMock);

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('Should return 403 when the request is not signed correctly', async () => {
//     const event = getApiGatewayEvent({
//       headers: {
//         'x-signature': 'XYZ',
//       },
//       body: JSON.stringify({ some: 'event' }),
//     });

//     const res = (await handler(event)) as APIGatewayProxyResult;

//     expect(res.statusCode).toStrictEqual(403);
//     expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
//   });

//   test('Should return 204 when no event type is provided', async () => {
//     const payload = {
//       ...getLabWebhookPayload('lab-id', 'LabsUpdated'),
//       type: undefined as unknown as string,
//     };
//     const res = (await handler(
//       createSignedPayload(payload),
//     )) as APIGatewayProxyResult;

//     expect(res.statusCode).toStrictEqual(204);
//     expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
//   });

//   test('Should put the squidex event into the event bus and return 200', async () => {
//     const payload = getLabWebhookPayload('lab-id', 'LabsUpdated');
//     const res = (await handler(
//       createSignedPayload(payload),
//     )) as APIGatewayProxyResult;

//     expect(res.statusCode).toStrictEqual(200);
//     expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
//       Entries: [
//         {
//           EventBusName: eventBus,
//           Source: eventSource,
//           DetailType: 'LabsUpdated',
//           Detail: JSON.stringify(payload),
//         },
//       ],
//     });
//   });
// });

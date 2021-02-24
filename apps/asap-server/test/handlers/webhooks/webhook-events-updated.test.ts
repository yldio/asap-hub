import { handler } from '../../../src/handlers/webhooks/webhook-events-updated';
import { apiGatewayEvent } from '../../helpers/events';

describe('Event Webhook', () => {
  test('Should not fail', async () => {
    expect(
      handler(
        apiGatewayEvent({
          body: undefined,
        }),
        {} as any,
        undefined as any,
      ),
    ).resolves.not.toThrow();
  });
});

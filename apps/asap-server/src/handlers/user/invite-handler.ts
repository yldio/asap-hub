import path from 'path';
import url from 'url';
import { SES } from 'aws-sdk';
import { EventBridgeEvent } from 'aws-lambda';
import { v4 as uuidV4 } from 'uuid';
import { RestUser, Squidex } from '@asap-hub/squidex';
import { origin, sesRegion } from '../../config';
import { SendEmail, sendEmailFactory } from '../../utils/send-email';

const uuidMatch =
  /^([\d\w]{8})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{4})-?([\d\w]{12})|[{0x]*([\d\w]{8})[0x, ]{4}([\d\w]{4})[0x, ]{4}([\d\w]{4})[0x, {]{5}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})[0x, ]{4}([\d\w]{2})$/;

export const inviteHandlerFactory =
  (sendEmail: SendEmail, userClient: Squidex<RestUser>) =>
  async (
    event: EventBridgeEvent<'Created', SquidexWebhookUserPayload>,
  ): Promise<void> => {
    const user = await userClient.fetchById(event.detail.payload.id);

    let code = user.data.connections.iv
      ?.map((c) => c.code)
      .find((c) => c.match(uuidMatch));

    if (!code) {
      code = uuidV4();

      await userClient.patch(user.id, {
        connections: {
          iv: [{ code }],
        },
      });
    }

    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    await sendEmail({
      to: [user.data.email.iv],
      template: 'Invite',
      values: {
        firstName: user.data.firstName.iv,
        link: link.toString(),
      },
    });
  };

const ses = new SES({
  apiVersion: '2010-12-01',
  region: sesRegion,
});

export const handler = inviteHandlerFactory(
  sendEmailFactory(ses),
  new Squidex('users'),
);

export type SquidexWebhookUserPayload = {
  type: 'UsersCreated';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Created';
    id: string;
  };
};

import { gp2, UserDataObject, UserUpdateDataObject } from '@asap-hub/model';
import { EventBridgeEvent, SQSEvent } from 'aws-lambda';
import path from 'path';
import url from 'url';
import { v4 as uuidV4 } from 'uuid';
import {
  EventBridgeHandler,
  Logger,
  SendEmail,
  SendEmailTemplate,
} from '../../utils';
import { UserPayload } from '../event-bus';

interface DataProvider {
  fetchById(id: string): Promise<gp2.UserDataObject | UserDataObject | null>;
  update(
    id: string,
    user: gp2.UserUpdateDataObject | UserUpdateDataObject,
    options?: { suppressConflict?: boolean } | null,
  ): Promise<void>;
}

async function tryCreateInvite(
  dataProvider: DataProvider,
  userId: string,
  code: string,
  logger: Logger,
  suppressConflict: boolean,
): Promise<boolean> {
  try {
    await dataProvider.update(
      userId,
      { connections: [{ code }] },
      { suppressConflict },
    );
    return true;
  } catch (err) {
    logger.error(err, 'Error while saving user data');
    throw new Error(`Unable to save the code for the user with ID ${userId}`);
  }
}

export const inviteHandlerFactory =
  <Provider extends DataProvider>(
    sendEmail: SendEmail,
    dataProvider: Provider,
    origin: string,
    logger: Logger,
    suppressConflict = false,
    template: SendEmailTemplate = 'Crn-Welcome',
  ): EventBridgeHandler<'UsersPublished', UserPayload> =>
  async (event) => {
    const userId = event.detail.resourceId;
    const user = await dataProvider.fetchById(userId);
    if (!user) {
      throw new Error(`Unable to find a user with ID ${userId}`);
    }

    if (user.connections?.length) {
      logger.info(
        `Found an existing connection code for user ${user.id}, exiting...`,
      );
      return;
    }

    logger.debug(
      `Attempting to invite user with ID ${userId}, e-mail address ${user.email}`,
    );

    const code = uuidV4();
    await tryCreateInvite(dataProvider, userId, code, logger, suppressConflict);

    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    try {
      await sendEmail({
        to: [user.email],
        template,
        values: {
          firstName: user.firstName,
          link: link.toString(),
        },
      });
    } catch (error) {
      logger.error(error, 'Error while sending email');
      throw new Error(
        `Unable to send the email for the user with ID ${userId}`,
      );
    }

    logger.info(`Invited user with ID ${user.id}`);
  };

export const sqsInviteHandlerFactory =
  <Provider extends DataProvider>(
    sendEmail: SendEmail,
    dataProvider: Provider,
    origin: string,
    logger: Logger,
    suppressConflict = false,
    template: SendEmailTemplate = 'Crn-Welcome',
  ) =>
  async (event: SQSEvent) => {
    for (const record of event.Records) {
      const ebEvent = JSON.parse(record.body) as EventBridgeEvent<
        'UsersPublished',
        UserPayload
      >;
      const handler = inviteHandlerFactory(
        sendEmail,
        dataProvider,
        origin,
        logger,
        suppressConflict,
        template,
      );
      await handler(ebEvent);
    }
  };

export type UserInviteEventBridgeEvent = EventBridgeEvent<
  'UsersPublished',
  UserPayload
>;

import { inviteUsersFactory } from '@asap-hub/management-scripts';
import logger from '../../utils/logger';
import { sendRawEmail } from '../../utils/send-mail';

export const handler = async () => {
  const emailBody: string[] = [];

  const logAndSaveOutputs = (row: any) => {
    if (typeof row === 'string') {
      // exclude error messages from email
      logger.info(row);
      emailBody.push(row);
    } else {
      logger.error(row);
    }
  };

  const inviteUsers = inviteUsersFactory(logAndSaveOutputs);

  try {
    await inviteUsers(undefined, true); // Reinvite users
  } catch (err) {
    logger.error(err);
  } finally {
    if (emailBody.length) {
      await sendRawEmail({
        to: ['joao.tiago@yld.io'], // TODO: add others, including sonya
        body: emailBody.join('\n'),
        subject: `Invite users output - ${new Date().toLocaleString()}`,
      });
    }
  }
};

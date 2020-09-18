import pLimit from 'p-limit';
import { SQSEvent } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';

import Users from '../../controllers/users';
import { CMSUser } from '../../entities/user';

export const handler = async (event: SQSEvent): Promise<lambda.Response> => {
  try {
    const [record] = event.Records;

    const limit = pLimit(10);
    const users = new Users();

    const usersToMail = JSON.parse(record?.body) as CMSUser['id'][];

    if (usersToMail?.length) {
      await Promise.all(
        usersToMail.map((user) => limit(() => users.sendWelcomeEmail(user))),
      );
    }

    return { statusCode: 200 };
  } catch (err) {
    // 500 will reset the event on the queue
    return { statusCode: 500 };
  }
};

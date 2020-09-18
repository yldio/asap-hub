/* eslint-disable no-constant-condition, no-await-in-loop */

import aws from 'aws-sdk';
import { framework as lambda, Squidex } from '@asap-hub/services-common';

import { Handler } from '../../utils/types';
import { CMSUser } from '../../entities/user';
import validateRequest from '../../utils/validate-squidex-request';

const { QUEUE_URL, EMAIL_QUEUE_BATCH_SIZE } = process.env;
const sqs = new aws.SQS({ apiVersion: '2012-11-05' });

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateRequest(request);

    const FETCH_SIZE = Number(EMAIL_QUEUE_BATCH_SIZE || 20);
    let skip = 0;
    let take = FETCH_SIZE;

    const users: Squidex<CMSUser> = new Squidex('users');

    while (true) {
      // squidex limitation: get users without code - do a sort on code and
      // filter the users that have
      const { items } = await users.fetch({
        skip,
        take,
        sort: [{ path: 'data.connections.iv', order: 'ascending' }],
      });
      const usersToMail = items.filter(
        (u) => !u.data.connections || !u.data.connections.iv.length,
      );

      if (!usersToMail.length) {
        break;
      }

      const params = {
        MessageBody: JSON.stringify(usersToMail.map(({ id }) => id)),
        QueueUrl: QUEUE_URL || 'Defined on serverless.js',
      };

      await sqs.sendMessage(params).promise();

      skip += FETCH_SIZE;
      take += FETCH_SIZE;
    }

    return { statusCode: 200 };
  },
);

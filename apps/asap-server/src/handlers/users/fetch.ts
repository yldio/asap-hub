import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';
import Users from '../../controllers/users';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (): Promise<lambda.Response> => {
    const users = new Users();
    const res = await users.fetch();

    return {
      payload: res,
    };
  },
);

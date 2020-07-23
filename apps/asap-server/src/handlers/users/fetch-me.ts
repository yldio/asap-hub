import { framework as lambda } from '@asap-hub/services-common';
import { APIGatewayProxyHandler } from 'aws-lambda';

import validateUser from '../../utils/validate-user';
import Users from '../../controllers/users';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { sub } = await validateUser(request);

    const users = new Users();
    const user = await users.fetchByCode(sub);

    return {
      payload: user,
    };
  },
);

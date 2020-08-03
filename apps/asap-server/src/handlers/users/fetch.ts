import { framework as lambda } from '@asap-hub/services-common';
import Users from '../../controllers/users';
import validateUser from '../../utils/validate-user';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const users = new Users();
    const res = await users.fetch();

    return {
      payload: res,
    };
  },
);

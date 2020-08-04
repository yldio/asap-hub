import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Users from '../../controllers/users';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { sub } = await validateUser(request);

    const users = new Users();
    const user = await users.fetchByCode(sub);

    return {
      payload: user,
    };
  },
);

import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Dashboard from '../../controllers/dashboard';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const dashboard = new Dashboard();
    const payload = await dashboard.fetch();

    return {
      statusCode: 200,
      payload,
    };
  },
);

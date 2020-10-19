import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Discover from '../../controllers/discover';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const discover = new Discover();
    const payload = await discover.fetch();

    return {
      statusCode: 200,
      payload,
    };
  },
);

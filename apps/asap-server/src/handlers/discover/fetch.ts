import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';

import validateUser from '../../utils/validate-user';
import Discover from '../../controllers/discover';
import { Handler } from '../../utils/types';

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const discover = new Discover(request.headers);
    const payload = await discover.fetch();

    return {
      statusCode: 200,
      payload,
    };
  },
);

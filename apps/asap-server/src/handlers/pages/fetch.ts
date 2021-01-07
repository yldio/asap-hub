import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import Pages from '../../controllers/pages';

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const path = request.params?.path;

    const controller = new Pages(request.headers);
    const page = await controller.fetchByPath(`/${path}`);

    return {
      payload: page,
    };
  },
);

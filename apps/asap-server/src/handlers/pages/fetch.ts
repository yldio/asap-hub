import { framework as lambda } from '@asap-hub/services-common';
import { Handler } from '../../utils/types';
import Pages from '../../controllers/pages';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const path = request.params?.path;

    const controller = new Pages();
    const page = await controller.fetchByPath(`/${path}`);

    return {
      payload: page,
    };
  },
);

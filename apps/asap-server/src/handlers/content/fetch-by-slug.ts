import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';

import Content from '../../controllers/content';
import { CreateSchema } from '../../entities/content';
import validateUser from '../../utils/validate-user';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const { content, slug } = lambda.validate(
      'params',
      request.params,
      CreateSchema,
    ) as {
      content: string;
      slug: string;
    };

    const contentClient = new Content();
    const res = await contentClient.fetchBySlug(content, slug);

    return {
      payload: res,
    };
  },
);

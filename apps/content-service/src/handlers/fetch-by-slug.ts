import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';
import Content from '../controllers/content';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const paramsSchema = Joi.object({
      content: Joi.string().required().valid('news'),
      slug: Joi.string().required(),
    }).required();

    const { content, slug } = lambda.validate(
      'params',
      request.params,
      paramsSchema,
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

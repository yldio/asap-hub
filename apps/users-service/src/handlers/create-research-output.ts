import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';
import { ResearchOutput } from '@asap-hub/model';

import validateUser from '../utils/validate-user';
import Users from '../controllers/users';
import ResearchOutputs from '../controllers/research-outputs';
import { createSchema } from '../entities/research-outputs';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { sub } = await validateUser(request);

    const users = new Users();
    const { id, displayName } = await users.fetchByCode(sub);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    if (id !== params.id) {
      throw Boom.forbidden();
    }

    // validate payload
    const payload = lambda.validate(
      'payload',
      request.payload,
      createSchema.required(),
    ) as ResearchOutput;

    const researchOutput = new ResearchOutputs();
    const output = await researchOutput.create(id, displayName, payload);

    return {
      statusCode: 201,
      payload: output,
    };
  },
);

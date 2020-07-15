import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../utils/validate-user';
import Users from '../controllers/users';
import Romps from '../controllers/romps';
import { CreateRomp } from '../cms/romps';
import { createSchema } from '../entities/romps';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { sub } = await validateUser(request);

    const users = new Users();
    const { id } = await users.fetchByCode(sub);

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
    ) as CreateRomp;

    const romps = new Romps();
    const romp = await romps.create(params.id, payload);

    return {
      statusCode: 201,
      payload: romp,
    };
  },
);

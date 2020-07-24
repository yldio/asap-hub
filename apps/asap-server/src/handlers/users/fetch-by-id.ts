import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';
import Users from '../../controllers/users';
import validateUser from '../../utils/validate-user';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    await validateUser(request);

    const users = new Users();
    const res = await users.fetchById(params.id);
    return {
      payload: res,
    };
  },
);

import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as lambda from '../framework/lambda';
import Users from '../controllers/users';

const fetchById = async (
  request: lambda.Request,
): Promise<lambda.Response> => {
  const paramsSchema = Joi.object({
    id: Joi.string().required(),
  }).required();

  const params = lambda.validate('params', request.params, paramsSchema) as {
    id: string;
  };

  const users = new Users();
  const res = await users.fetchById(params.id);
  return {
    payload: res,
  };
};

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { method } = request;
    if (method === 'get') {
      return fetchById(request);
    }

    // API Gateway ensures the right HTTP methods are invoked.
    // In theory the following lines are dead code.
    // istanbul ignore next
    throw Boom.methodNotAllowed();
  },
);

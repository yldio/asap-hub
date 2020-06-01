import Boom from '@hapi/boom';
import { APIGatewayProxyHandler } from 'aws-lambda';
import connection from '../utils/connection';
import * as lambda from '../framework/lambda';
import * as users from '../routes/users';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { method } = request;
    if (method === 'get') {
      const client = await connection();
      return users.fetchByCode(request, {
        connection: client,
      });
    }

    // istanbul ignore else
    if (method === 'post') {
      const client = await connection();
      return users.connectByCode(request, {
        connection: client,
      });
    }

    // API Gateway ensures the right HTTP methods are invoked.
    // In theory the following lines are dead code.
    // istanbul ignore next
    throw Boom.methodNotAllowed();
  },
);

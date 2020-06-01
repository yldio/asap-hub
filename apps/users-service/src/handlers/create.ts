import { APIGatewayProxyHandler } from 'aws-lambda';
import connection from '../utils/connection';
import * as lambda from '../framework/lambda';
import * as users from '../routes/users';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const client = await connection();
    return users.create(request, {
      connection: client,
    });
  },
);

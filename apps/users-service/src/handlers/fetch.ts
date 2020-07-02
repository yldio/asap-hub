import { APIGatewayProxyHandler } from 'aws-lambda';
import * as lambda from '../framework/lambda';
import Users from '../controllers/users';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (): Promise<lambda.Response> => {
    const users = new Users();
    const res = await users.fetch();

    return {
      payload: res,
    };
  },
);

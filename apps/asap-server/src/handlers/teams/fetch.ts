import { APIGatewayProxyHandler } from 'aws-lambda';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Teams from '../../controllers/teams';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const teams = new Teams();
    const team = await teams.fetch();

    return {
      statusCode: 200,
      payload: team,
    };
  },
);

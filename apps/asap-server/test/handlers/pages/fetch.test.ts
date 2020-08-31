import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/handlers/pages/fetch';
import { apiGatewayEvent } from '../../helpers/events';

describe('Get /pages/{path+}', () => {
  test('returns 200 when page is found', async () => {
    const res = (await handler(
      apiGatewayEvent({
        pathParameters: {
          path: 'privacy-policy',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });

  test("returns 404 when page isn't found", async () => {
    const res = (await handler(
      apiGatewayEvent({
        pathParameters: {
          path: 'not-found-page',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });
});

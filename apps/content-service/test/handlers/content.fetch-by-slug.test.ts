import { handler } from '../../src/handlers/fetch-by-slug';
import { apiGatewayEvent } from '../helpers/events';

describe('GET /content/{content}/{slug}', () => {
  test('returns 404 when no content is found', async () => {
    const result = await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          content: 'news',
          slug: 'not-found-slug',
        },
      }),
      null,
      null,
    );

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when content is found', async () => {
    const result = await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          content: 'news',
          slug: 'exists-in-dev',
        },
      }),
      null,
      null,
    );

    expect(result.statusCode).toStrictEqual(200);
  });
});

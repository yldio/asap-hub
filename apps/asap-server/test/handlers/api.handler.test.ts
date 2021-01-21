import { apiHandler } from '../../src/handlers/api-handler';
import { apiGatewayEvent } from '../helpers/events';

describe('API handler', () => {
  test('Responds to lambda event', async () => {
    const response = await apiHandler(
      apiGatewayEvent({
        rawPath: '/events/',
        pathParameters: {
          asdas: 'Asdsa',
        },
        requestContext: {
          http: {
            method: 'GET',
            path: '/events',
          },
        },
      }),
      {} as any,
    );

    expect(response).toMatchObject({
      body: expect.any(String),
      statusCode: expect.any(Number),
      headers: expect.any(Object),
    });
  });
});

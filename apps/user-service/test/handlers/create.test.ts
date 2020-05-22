import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/create';
import { apiGatewayEvent } from '../utils/events';

const chance = new Chance();
describe('/api/users', () => {
  test('reject invalid payload', async () => {
    const user = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const result = (await handler(
      apiGatewayEvent({
        body: {
          ...user,
          property: 'other',
        },
        httpMethod: 'POST',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('return 201', async () => {
    const result = (await handler(
      apiGatewayEvent({
        body: {
          displayName: `${chance.first()} ${chance.last()}`,
          email: chance.email(),
        },
        httpMethod: 'POST',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(201);
  });
});

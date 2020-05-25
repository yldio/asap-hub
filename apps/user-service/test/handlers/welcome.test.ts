import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';
import { apiGatewayEvent } from '../helpers/events';
import { handler } from '../../src/handlers/welcome';

jest.mock('../../src/routes/users', () => ({
  fetchByCode: jest.fn().mockResolvedValue({ statusCode: 200 }),
  connectByCode: jest.fn().mockResolvedValue({ statusCode: 200 }),
}));

test('GET /api/profile/{code} invoke route fetchByCode', async () => {
  const result = (await handler(
    apiGatewayEvent({}),
    null,
    null,
  )) as APIGatewayProxyResult;

  expect(result.statusCode).toStrictEqual(200);
});

test('POST /api/profile/{code} invokes route connectByCode', async () => {
  const result = (await handler(
    apiGatewayEvent({
      httpMethod: 'POST',
    }),
    null,
    null,
  )) as APIGatewayProxyResult;

  expect(result.statusCode).toStrictEqual(200);
});

import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/create';
import { apiGatewayEvent } from '../helpers/events';

jest.mock('../../src/routes/users', () => ({
  create: jest.fn().mockResolvedValue({ statusCode: 200 }),
}));

test('POST /api/users invoke route create', async () => {
  const result = (await handler(
    apiGatewayEvent({}),
    null,
    null,
  )) as APIGatewayProxyResult;

  expect(result.statusCode).toStrictEqual(200);
});

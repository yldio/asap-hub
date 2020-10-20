import Boom from '@hapi/boom';
import { http } from '../../src/framework/lambda';
import { apiGatewayEvent } from '../helpers/events';
import { origin } from '../../src/config';

test('http returns 400 on invalid body', async () => {
  const handler = http(async (_) => {
    return {
      statusCode: 200,
    };
  });

  const result = await handler(
    apiGatewayEvent({
      body: 'invalid',
    }),
  );
  expect(result.statusCode).toStrictEqual(400);
});

test('http returns statuCode of Boom error', async () => {
  const handler = http(async (_) => {
    throw Boom.forbidden();
  });
  const result = await handler(apiGatewayEvent({}));
  expect(result.statusCode).toStrictEqual(403);
});

test('http returns data from Boom error in payload', async () => {
  const handler = http(async (_) => {
    throw Boom.badRequest('hello', {
      details: {
        hello: 'world',
      },
    });
  });

  const result = await handler(apiGatewayEvent({}));
  expect(result.statusCode).toStrictEqual(400);
  expect(result.body).toStrictEqual(
    JSON.stringify({
      statusCode: 400,
      error: 'Bad Request',
      message: 'hello',
      details: {
        hello: 'world',
      },
    }),
  );
});

test('http returns 500 on unknown execption', async () => {
  const handler = http(async (_) => {
    throw new Error('uncaught');
  });
  const result = await handler(apiGatewayEvent({}));
  expect(result.statusCode).toStrictEqual(500);
  expect(result.body).toStrictEqual(
    JSON.stringify({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    }),
  );
});

test('http default status code is 200', async () => {
  const handler = http(async (_) => {
    return {
      payload: {
        hello: 'world',
      },
    };
  });
  const result = await handler(apiGatewayEvent({}));
  expect(result.statusCode).toStrictEqual(200);
});

test('http parses query string params correctly', async () => {
  const fn = jest.fn().mockResolvedValue({});
  const handler = http(fn);
  const result = await handler(
    apiGatewayEvent({
      queryStringParameters: {
        key1: 'foo',
        key2: 'foo,bar',
      },
    }),
  );
  expect(fn).toBeCalledWith(
    expect.objectContaining({
      query: {
        key1: 'foo',
        key2: ['foo', 'bar'],
      },
    }),
  );
});

test('http stringifies payload into body', async () => {
  const payload = {
    hello: 'world',
  };
  const handler = http(async (_) => {
    return {
      payload,
    };
  });
  const result = await handler(apiGatewayEvent({}));
  expect(result.body).toStrictEqual(JSON.stringify(payload));
});

test('http returns cors headers', async () => {
  const payload = {
    hello: 'world',
  };
  const handler = http(async (_) => {
    return {
      payload,
    };
  });

  const result = await handler(apiGatewayEvent({}));
  expect(result.headers).toStrictEqual({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': origin,
    'content-type': 'application/json',
  });
});

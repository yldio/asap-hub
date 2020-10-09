import useFetch from 'use-http';
import { useFetchOptions } from '../util';

import { useApiGet } from '../hooks';

jest.mock('use-http');
jest.mock('../util');

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;
const mockUseFetchOptions = useFetchOptions as jest.MockedFunction<
  typeof useFetchOptions
>;
afterEach(() => {
  jest.resetAllMocks();
});
it('Handles requests without parameters ', async () => {
  useApiGet('test');
  expect(mockUseFetch.mock.calls[0][0]).toMatchInlineSnapshot(
    `"http://localhost:3333/development/test"`,
  );
});
it('Handles requests with a string ', async () => {
  useApiGet('test', { test: '123' });
  expect(mockUseFetch.mock.calls[0][0]).toMatchInlineSnapshot(
    `"http://localhost:3333/development/test?test=123"`,
  );
});
it('Handles requests with an array ', async () => {
  useApiGet('test', { test: ['123', '456'] });
  expect(mockUseFetch.mock.calls[0][0]).toMatchInlineSnapshot(
    `"http://localhost:3333/development/test?test=123&test=456"`,
  );
});

it('Handles an empty value', async () => {
  useApiGet('test', { test: '' });
  expect(mockUseFetch.mock.calls[0][0]).toMatchInlineSnapshot(
    `"http://localhost:3333/development/test?test="`,
  );
});

it('Passes through fetch options if provided', async () => {
  useApiGet('test', {}, { headers: [['test', '123']] });
  expect(mockUseFetchOptions.mock.calls[0][0]).toMatchInlineSnapshot(`
    Object {
      "headers": Array [
        Array [
          "test",
          "123",
        ],
      ],
    }
  `);
});

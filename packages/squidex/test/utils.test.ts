import { parseDate, createURL } from '../src/utils';
import { config } from '@asap-hub/squidex';

describe('generate asset url from cms assets list', () => {
  test('return a url of the assets', async () => {
    expect(createURL(['1', '2'])).toEqual([
      `${config.baseUrl}/api/assets/${config.appName}/1`,
      `${config.baseUrl}/api/assets/${config.appName}/2`,
    ]);
  });
});

describe('dates from squidex', () => {
  test('parse return Date type', async () => {
    expect(parseDate('2020-09-08T03:05:08Z')).toEqual(
      new Date('2020-09-08T03:05:08.000Z'),
    );
  });
});

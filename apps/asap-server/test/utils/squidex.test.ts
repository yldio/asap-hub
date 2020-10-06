import { parseDate, formatDate, createURL } from '../../src/utils/squidex';
import { cms } from '../../src/config';

describe('generate asset url from cms assets list', () => {
  test('return a url of the assets', async () => {
    expect(createURL(['1', '2'])).toEqual([
      `${cms.baseUrl}/api/assets/${cms.appName}/1`,
      `${cms.baseUrl}/api/assets/${cms.appName}/2`,
    ]);
  });
});

describe('dates from squidex', () => {
  test('parse return Date type', async () => {
    expect(parseDate('2020-09-08T03:05:08Z')).toEqual(
      new Date('2020-09-08T03:05:08.000Z'),
    );
  });

  test('format returns string type', async () => {
    expect(formatDate(new Date('2020-09-08T03:05:08.000Z'))).toEqual(
      '2020-09-08T03:05:08Z',
    );
  });
});

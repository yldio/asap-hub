import config from '../src/config';
import {
  parseDate,
  createURL,
  parseToSquidex,
  sanitiseForSquidex,
} from '../src/utils';

describe('Squidex Utils', () => {
  describe('createUrl - generate asset url from cms assets list', () => {
    test('return a url of the assets', async () => {
      expect(createURL(['1', '2'])).toEqual([
        `${config.baseUrl}/api/assets/${config.appName}/1`,
        `${config.baseUrl}/api/assets/${config.appName}/2`,
      ]);
    });
  });

  describe('parseDate - parse dates from squidex', () => {
    test('parse return Date type', async () => {
      expect(parseDate('2020-09-08T03:05:08Z')).toEqual(
        new Date('2020-09-08T03:05:08.000Z'),
      );
    });
  });

  describe('sanitiseForSquidex - sanitise text for squidex', () => {
    test('sanitise return string', async () => {
      expect(sanitiseForSquidex(`"'+/?#&`)).toEqual('%22%27%27%2B%2F%3F%23%26');
    });
  });

  describe('parseToSquidex - parse object to squidex', () => {
    test('parse return object', async () => {
      const object = {
        a: 'a',
        b: 'b',
        c: 'c',
      };

      expect(parseToSquidex(object)).toStrictEqual({
        a: { iv: 'a' },
        b: { iv: 'b' },
        c: { iv: 'c' },
      });
    });

    test('removed undefined values', async () => {
      const object = {
        a: 'a',
        b: 'b',
        c: undefined,
      };

      expect(parseToSquidex(object)).toStrictEqual({
        a: { iv: 'a' },
        b: { iv: 'b' },
      });
    });

    test('pass nulls', async () => {
      const object = {
        a: 'a',
        b: 'b',
        c: null,
      };

      expect(parseToSquidex(object)).toStrictEqual({
        a: { iv: 'a' },
        b: { iv: 'b' },
        c: { iv: null },
      });
    });
  });
});

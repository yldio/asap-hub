import { createURL } from '../../src/utils/assets';
import { cms } from '../../src/config';

describe('generate asset url from cms assets list', () => {
  test('return a url of the assets', async () => {
    expect(createURL(['1', '2'])).toEqual([
      `${cms.baseUrl}/api/assets/${cms.appName}/1`,
      `${cms.baseUrl}/api/assets/${cms.appName}/2`,
    ]);
  });
});

import nodeFetch from 'node-fetch';
import { config } from '../../config';

describe('Pages endpoints', () => {
  test('Should get the privacy-policy page', async () => {
    const response = await nodeFetch(
      `${config.appOrigin}/pages/privacy-policy`,
    );
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body).toMatchObject({
      path: '/privacy-policy',
    });
  });
});

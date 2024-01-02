import { config } from '../../config';

describe('Pages endpoints', () => {
  test('Should get the privacy-policy page', async () => {
    console.log({ origin: config.apiOrigin });
    const response = await fetch(`${config.apiOrigin}/pages/privacy-policy`);
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body).toMatchObject({
      path: '/privacy-policy',
    });
  }, 30_000);
});

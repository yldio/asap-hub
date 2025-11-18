import { config } from '../../config';

describe('Pages endpoints', () => {
  test('Should get the privacy-notice page', async () => {
    console.log({ origin: config.apiOrigin });
    const response = await fetch(`${config.apiOrigin}/pages/privacy-notice`);
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body).toMatchObject({
      path: '/privacy-notice',
    });
  }, 30_000);
});

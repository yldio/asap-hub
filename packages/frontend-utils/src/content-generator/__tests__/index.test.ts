import { generateContent } from '..';

const apiUrl = 'http://api.example.com';
const descriptionMD = 'markdown description';

describe('generateContent', () => {
  it('returns a successfully fetched short description', async () => {
    const response = { shortDescription: 'short description' };
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(response),
      } as Response),
    );

    const result = await generateContent(
      descriptionMD,
      apiUrl,
      'Bearer x',
      'CRN',
    );
    expect(result).toEqual(response);
  });

  it.each`
    app      | error
    ${'CRN'} | ${'Failed to generate content for research output'}
    ${'GP2'} | ${'Failed to generate content for output'}
  `('throws the correct error for "$app" app', async ({ app, error }) => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve(),
      } as Response),
    );

    await expect(
      generateContent(descriptionMD, apiUrl, 'Bearer x', app),
    ).rejects.toThrow(new RegExp(error, 'i'));
  });
});

import { render } from '@testing-library/react';

import UnsupportedBrowserPage from '../UnsupportedBrowserPage';

it('renders a heading', () => {
  const { getByRole } = render(<UnsupportedBrowserPage />);
  expect(getByRole('heading')).toHaveTextContent(/browser/i);
});

it('links to supported browsers', () => {
  const { getAllByRole } = render(<UnsupportedBrowserPage />);
  expect((getAllByRole('link') as HTMLAnchorElement[]).map(({ href }) => href))
    .toMatchInlineSnapshot(`
    [
      "https://www.google.com/chrome/",
      "https://www.apple.com/safari/",
      "https://www.microsoft.com/edge",
      "https://www.mozilla.org/firefox",
    ]
  `);
});

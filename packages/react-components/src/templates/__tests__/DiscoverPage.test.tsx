import { render } from '@testing-library/react';

import DiscoverPage from '../DiscoverPage';

it('renders the header', () => {
  const { getByRole } = render(<DiscoverPage>Content</DiscoverPage>);
  expect(getByRole('heading')).toBeVisible();
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Guides & Tutorials"`,
  );
});

it('renders the children', () => {
  const { getByText } = render(<DiscoverPage>Content</DiscoverPage>);
  expect(getByText('Content')).toBeVisible();
});

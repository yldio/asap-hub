import { render } from '@testing-library/react';

import DiscoverPageHeader from '../DiscoverPageHeader';

it('renders the header', () => {
  const { getByRole } = render(<DiscoverPageHeader />);
  expect(getByRole('heading')).toBeVisible();
});

it('displays header mesage', () => {
  const { getByRole } = render(<DiscoverPageHeader />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Guides & Tutorials"`,
  );
});

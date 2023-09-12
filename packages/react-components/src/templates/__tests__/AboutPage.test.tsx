import { render } from '@testing-library/react';

import AboutPage from '../AboutPage';

it('renders the header', () => {
  const { getByRole } = render(<AboutPage />);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent('About ASAP');
});

it('renders the children', () => {
  const { getByText } = render(<AboutPage>Content</AboutPage>);
  expect(getByText('Content')).toBeVisible();
});

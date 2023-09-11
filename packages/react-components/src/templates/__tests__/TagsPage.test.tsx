import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';

import TagsPage from '../TagsPage';

it('renders the tags page header and children', () => {
  render(<TagsPage tags={[]}>Test</TagsPage>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/tags/i);
  expect(screen.getByText('Test')).toBeVisible();
});

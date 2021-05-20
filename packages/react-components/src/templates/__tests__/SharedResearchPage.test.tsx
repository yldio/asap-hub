import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchPage from '../SharedResearchPage';

const props: ComponentProps<typeof SharedResearchPage> = {
  searchQuery: '',
  filters: new Set(),
};
it('renders the header', () => {
  const { getByRole } = render(
    <SharedResearchPage {...props}>Content</SharedResearchPage>,
  );
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <SharedResearchPage {...props}>Content</SharedResearchPage>,
  );
  expect(getByText('Content')).toBeVisible();
});

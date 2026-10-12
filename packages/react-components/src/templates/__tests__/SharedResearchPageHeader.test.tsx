import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchPageHeader from '../SharedResearchPageHeader';

const props: ComponentProps<typeof SharedResearchPageHeader> = {
  searchQuery: '',
  filters: new Set(),
};
it('renders the header', () => {
  const { getByRole } = render(<SharedResearchPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <SharedResearchPageHeader {...props} searchQuery={'test123'} />,
  );
  expect(getByRole('searchbox')).toHaveValue('test123');
});

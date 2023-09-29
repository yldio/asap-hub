import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import TutorialsPageHeader from '../TutorialsPageHeader';

const props: ComponentProps<typeof TutorialsPageHeader> = {
  searchQuery: '',
  onSearchQueryChange: jest.fn(),
};

it('renders the title and subtitle', () => {
  render(<TutorialsPageHeader {...props} />);

  expect(screen.getByText(/tutorials/i, { selector: 'h2' })).toBeVisible();
  expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <TutorialsPageHeader {...props} searchQuery={'test123'} />,
  );
  expect(getByRole('searchbox')).toHaveValue('test123');
});

import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import DiscoveryProjects from '../DiscoveryProjects';

const props: ComponentProps<typeof DiscoveryProjects> = {
  searchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

it('renders the Discovery Projects page', () => {
  const { container } = render(<DiscoveryProjects {...props} />);
  expect(
    screen.getByText(
      /Discovery Projects are collaborative research projects whose primary objective/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
});

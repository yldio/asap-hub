import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import ResourceProjects from '../ResourceProjects';

const props: ComponentProps<typeof ResourceProjects> = {
  searchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

it('renders the Resource Projects page', () => {
  const { container } = render(<ResourceProjects {...props} />);
  expect(
    screen.getByText(
      /Resource Projects are projects whose primary objective is to generate research tools/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
});

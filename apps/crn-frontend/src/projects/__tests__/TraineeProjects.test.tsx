import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import TraineeProjects from '../TraineeProjects';

const props: ComponentProps<typeof TraineeProjects> = {
  searchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

it('renders the Trainee Projects page', () => {
  const { container } = render(<TraineeProjects {...props} />);
  expect(
    screen.getByText(
      /Trainee Projects provide early-career scientists with dedicated support/i,
    ),
  ).toBeVisible();
  expect(container.querySelector('section')).toBeInTheDocument();
});

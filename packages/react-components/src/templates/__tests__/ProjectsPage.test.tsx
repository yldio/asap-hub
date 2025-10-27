import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import ProjectsPage from '../ProjectsPage';

const props: ComponentProps<typeof ProjectsPage> = {
  page: 'Discovery',
  searchQuery: '',
  onChangeSearchQuery: jest.fn(),
  filters: new Set(),
  onChangeFilter: jest.fn(),
};

it('renders the ProjectsPage component', () => {
  const { container } = render(
    <ProjectsPage {...props}>
      <div>Test Content</div>
    </ProjectsPage>,
  );
  expect(container.querySelector('article')).toBeInTheDocument();
  expect(container.querySelector('main')).toBeInTheDocument();
  expect(screen.getByText('Projects')).toBeVisible();
  expect(screen.getByText('Test Content')).toBeVisible();
});

import { render, screen } from '@testing-library/react';
import ProjectPageList from '../ProjectPageList';

const props = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  isAdministrator: true,
  searchQuery: '',
  hasProjects: true,
};

describe('ProjectPageList', () => {
  it('renders the header', () => {
    render(<ProjectPageList {...props}>Content</ProjectPageList>);
    expect(screen.getByRole('search')).toBeVisible();
  });

  it('does not render the header when hasOutputs is false', () => {
    render(
      <ProjectPageList {...props} hasProjects={false}>
        Content
      </ProjectPageList>,
    );
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
  });
});

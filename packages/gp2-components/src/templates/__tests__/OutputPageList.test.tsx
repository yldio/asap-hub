import { render, screen } from '@testing-library/react';
import OutputPageList from '../OutputPageList';

const props = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  isAdministrator: true,
  searchQuery: '',
  hasOutputs: true,
};

describe('OutputPageList', () => {
  it('renders the header', () => {
    render(<OutputPageList {...props}>Content</OutputPageList>);
    expect(screen.getByRole('search')).toBeVisible();
  });

  it('does not render the header when hasOutputs is false', () => {
    render(
      <OutputPageList {...props} hasOutputs={false}>
        Content
      </OutputPageList>,
    );
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
  });
});

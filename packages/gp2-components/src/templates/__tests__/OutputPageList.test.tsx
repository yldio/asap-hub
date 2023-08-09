import { render, screen } from '@testing-library/react';
import OutputPageList from '../OutputPageList';

const props = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  searchQuery: '',
  filters: new Set<string>(),
};

describe('OutputPageList', () => {
  it('renders the header', () => {
    render(<OutputPageList {...props}>Content</OutputPageList>);
    expect(screen.getByRole('search')).toBeVisible();
  });
});

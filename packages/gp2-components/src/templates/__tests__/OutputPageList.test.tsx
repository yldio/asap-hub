import { render, screen } from '@testing-library/react';
import OutputPageList from '../OutputPageList';

const props = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  searchQuery: '',
  hasOutputs: true,
};

describe('OutputPageList', () => {
  it('renders the header', () => {
    render(<OutputPageList {...props}>Content</OutputPageList>);
    expect(screen.getByRole('search')).toBeVisible();
  });
});

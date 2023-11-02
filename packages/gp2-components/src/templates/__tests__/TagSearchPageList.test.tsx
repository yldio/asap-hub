import { render, screen } from '@testing-library/react';
import TagSearchPageList from '../TagSearchPageList';

const props = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  isAdministrator: true,
  searchQuery: '',
  hasResults: true,
};

describe('TagSearchPageList', () => {
  it('renders the header', () => {
    render(<TagSearchPageList {...props}>Content</TagSearchPageList>);
    expect(screen.getByRole('search')).toBeVisible();
  });
});

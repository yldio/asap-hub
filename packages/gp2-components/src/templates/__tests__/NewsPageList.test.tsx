import { render } from '@testing-library/react';
import NewsPageList from '../NewsPageList';

const props = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  searchQuery: '',
  filters: new Set<string>(),
};

describe('NewsPageList', () => {
  it('renders the header', () => {
    const { getByRole } = render(
      <NewsPageList {...props}>Content</NewsPageList>,
    );
    expect(getByRole('search')).toBeVisible();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TagSearchPageList, {
  TagSearchPageListProps,
} from '../TagSearchPageList';

const props: TagSearchPageListProps = {
  onChangeFilter: jest.fn(),
  onChangeSearch: jest.fn(),
  searchQuery: '',
};

describe('TagSearchPageList', () => {
  it('renders the header', () => {
    render(<TagSearchPageList {...props}>Content</TagSearchPageList>);
    expect(screen.getByRole('search')).toBeVisible();
  });

  it('handles no tag options', async () => {
    const loadTags = jest.fn().mockResolvedValue([]);
    render(
      <TagSearchPageList {...props} loadTags={loadTags}>
        Content
      </TagSearchPageList>,
    );

    userEvent.click(screen.getByRole('textbox'));
    expect(loadTags).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText('No results found')).toBeVisible(),
    );
  });

  it('calls setTags on tag selection', async () => {
    const loadTags = jest
      .fn()
      .mockResolvedValue([{ label: 'foo', value: 'foo' }]);
    const setTags = jest.fn();
    render(
      <TagSearchPageList {...props} loadTags={loadTags} setTags={setTags} />,
    );
    userEvent.type(screen.getByRole('textbox'), "doesn't matter");
    await waitFor(() => expect(screen.getByText('foo')).toBeVisible());
    userEvent.click(screen.getByText('foo'));
    expect(setTags).toHaveBeenCalledWith(['foo']);
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';

import TagsPageHeader from '../TagsPageHeader';

const props: ComponentProps<typeof TagsPageHeader> = {
  tags: [],
};

it('renders the header', () => {
  render(<TagsPageHeader {...props} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Tags Search',
  );
});

it('displays supplied tag', () => {
  render(<TagsPageHeader {...props} tags={['key']} />);
  expect(screen.getByText('key')).toBeVisible();
});

it("shows the no results found message when there aren't any tags", async () => {
  const loadTags = jest.fn().mockResolvedValue([]);
  render(<TagsPageHeader {...props} loadTags={loadTags} />);
  userEvent.type(screen.getByRole('textbox'), 'foo');
  await waitFor(() =>
    expect(screen.getByText('No results found')).toBeVisible(),
  );
  expect(loadTags).toHaveBeenCalled();
});

it('will call set tags when a tag has been selected', async () => {
  const loadTags = jest
    .fn()
    .mockResolvedValue([{ label: 'foo', value: 'foo' }]);
  const setTags = jest.fn();
  render(<TagsPageHeader {...props} loadTags={loadTags} setTags={setTags} />);
  userEvent.type(screen.getByRole('textbox'), "doesn't matter");
  await waitFor(() => expect(screen.getByText('foo')).toBeVisible());
  userEvent.click(screen.getByText('foo'));
  expect(setTags).toHaveBeenCalledWith(['foo']);
});

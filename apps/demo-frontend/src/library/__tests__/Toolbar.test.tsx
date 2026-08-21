import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { nextStatusFilter, type StatusFilter } from '../state';
import { Toolbar } from '../Toolbar';

const renderToolbar = (props: Partial<Parameters<typeof Toolbar>[0]> = {}) => {
  const onQueryChange = jest.fn();
  const onSortChange = jest.fn();
  const onViewChange = jest.fn();
  const onStatusFilterClick = jest.fn();
  const onCreateFolderHere = jest.fn();

  render(
    <MemoryRouter>
      <Toolbar
        query=""
        onQueryChange={onQueryChange}
        sort="newest"
        onSortChange={onSortChange}
        view="grid"
        onViewChange={onViewChange}
        statusFilter="all"
        onStatusFilterClick={onStatusFilterClick}
        isCreator
        currentLocationName="Engineering"
        canCreateHere
        onCreateFolderHere={onCreateFolderHere}
        {...props}
      />
    </MemoryRouter>,
  );

  return {
    onQueryChange,
    onSortChange,
    onViewChange,
    onStatusFilterClick,
    onCreateFolderHere,
  };
};

it('reports every keystroke in the search box', async () => {
  const { onQueryChange } = renderToolbar();

  await userEvent.type(screen.getByLabelText('Search videos'), 'ab');

  expect(onQueryChange).toHaveBeenCalledTimes(2);
  expect(onQueryChange).toHaveBeenLastCalledWith('b');
});

it('shows the current sort and reports a new one', async () => {
  const { onSortChange } = renderToolbar({ sort: 'oldest' });

  const trigger = screen.getByRole('button', { name: 'Sort videos' });
  expect(trigger).toHaveTextContent('Oldest first');

  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole('option', { name: 'Title A-Z' }));

  expect(onSortChange).toHaveBeenCalledWith('title');
});

it('marks the active view and reports a switch', async () => {
  const { onViewChange } = renderToolbar({ view: 'list' });

  expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );

  await userEvent.click(screen.getByRole('button', { name: 'Grid view' }));

  expect(onViewChange).toHaveBeenCalledWith('grid');
});

describe('status chip', () => {
  it.each<[StatusFilter, string]>([
    ['all', 'All statuses'],
    ['published', 'Published'],
    ['drafts', 'Drafts'],
  ])('labels the %s filter', (statusFilter, label) => {
    renderToolbar({ statusFilter });
    expect(screen.getByRole('button', { name: label })).toBeVisible();
  });

  it('cycles all to published to drafts and back', () => {
    expect(nextStatusFilter('all')).toBe('published');
    expect(nextStatusFilter('published')).toBe('drafts');
    expect(nextStatusFilter('drafts')).toBe('all');
  });

  it('asks for the next filter when clicked', async () => {
    const { onStatusFilterClick } = renderToolbar();

    await userEvent.click(screen.getByRole('button', { name: 'All statuses' }));

    expect(onStatusFilterClick).toHaveBeenCalledTimes(1);
  });
});

describe('new folder popover', () => {
  it('creates a folder named after the current location', async () => {
    const { onCreateFolderHere } = renderToolbar();

    await userEvent.click(screen.getByRole('button', { name: /New folder/ }));
    await userEvent.type(
      screen.getByLabelText('New folder name in Engineering'),
      'Ops{Enter}',
    );

    expect(onCreateFolderHere).toHaveBeenCalledWith('Ops');
  });

  it('ignores a blank name', async () => {
    const { onCreateFolderHere } = renderToolbar();

    await userEvent.click(screen.getByRole('button', { name: /New folder/ }));
    await userEvent.type(
      screen.getByLabelText('New folder name in Engineering'),
      '   {Enter}',
    );

    expect(onCreateFolderHere).not.toHaveBeenCalled();
  });

  it('closes the popover on Escape', async () => {
    renderToolbar();

    await userEvent.click(screen.getByRole('button', { name: /New folder/ }));
    const input = screen.getByLabelText('New folder name in Engineering');
    await userEvent.type(input, '{Escape}');

    expect(
      screen.queryByLabelText('New folder name in Engineering'),
    ).toBeNull();
  });

  it('explains why the button is disabled at the deepest level', () => {
    renderToolbar({ canCreateHere: false });

    expect(screen.getByRole('button', { name: /New folder/ })).toHaveAttribute(
      'title',
      'This folder is already at the deepest level',
    );
  });
});

it('hides the creator-only controls from a member', () => {
  renderToolbar({ isCreator: false });

  expect(screen.getByLabelText('Search videos')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Sort videos' })).toBeVisible();
  expect(screen.queryByRole('button', { name: 'All statuses' })).toBeNull();
  expect(screen.queryByRole('button', { name: /New folder/ })).toBeNull();
  expect(screen.queryByRole('link', { name: /Upload/ })).toBeNull();
});

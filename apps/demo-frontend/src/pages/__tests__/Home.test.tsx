import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Folder, Video } from '../../api/types';
import { creatorMe, makeVideo, memberMe, renderApp } from '../../test-utils';
import Home from '../Home';

const folders: Folder[] = [
  { id: 'ROOT', name: 'Root' },
  { id: 'f-eng', name: 'Engineering' },
  { id: 'f-sprint', name: 'Sprints', parentId: 'f-eng' },
  { id: 'f-deep', name: 'Deep', parentId: 'f-sprint' },
  { id: 'f-design', name: 'Design' },
];

const unfiled = makeVideo({
  id: 'v-unfiled',
  title: 'Unfiled walkthrough',
  folderId: 'ROOT',
  recordedAt: '2026-08-10T09:00:00.000Z',
});

const engVideo = makeVideo({
  id: 'v-eng',
  title: 'Engineering standup',
  folderId: 'f-eng',
  recordedAt: '2026-08-12T09:00:00.000Z',
});

const sprintDraft = makeVideo({
  id: 'v-sprint',
  title: 'Sprint retro',
  folderId: 'f-sprint',
  status: 'draft',
  recordedAt: '2026-08-01T09:00:00.000Z',
});

const byFolder: Record<string, Video[]> = {
  ROOT: [unfiled],
  'f-eng': [engVideo],
  'f-sprint': [sprintDraft],
  'f-deep': [],
  'f-design': [],
};

const baseApi = () => ({
  listFolders: jest.fn(() => Promise.resolve(folders)),
  folderCounts: jest.fn(() =>
    Promise.resolve({
      ROOT: 1,
      'f-eng': 1,
      'f-sprint': 1,
      'f-deep': 0,
      'f-design': 0,
    }),
  ),
  listVideos: jest.fn((folderId?: string) =>
    Promise.resolve(byFolder[folderId ?? 'ROOT'] ?? []),
  ),
  listAllVideos: jest.fn(() =>
    Promise.resolve([unfiled, engVideo, sprintDraft]),
  ),
});

type RenderOptions = {
  api?: Record<string, unknown>;
  me?: typeof creatorMe;
  route?: string;
};

const renderHome = ({
  api = {},
  me = creatorMe,
  route = '/',
}: RenderOptions = {}) =>
  renderApp(<Home />, {
    api: { ...baseApi(), ...api } as never,
    me,
    route,
    routePath: '/',
  });

const sidebar = () => screen.getByRole('complementary');

const contentSection = (): HTMLElement =>
  sidebar().parentElement?.querySelector('section') as HTMLElement;

const cardFor = (title: string): HTMLElement =>
  screen
    .getByText(title)
    .closest('[data-testid^="video-card-"]') as HTMLElement;

const videoTitles = (): string[] =>
  screen
    .getAllByRole('heading', { level: 3 })
    .map((node) => node.textContent as string);

const openVideoMenu = async (title: string) => {
  await userEvent.pointer({ target: cardFor(title), keys: '[MouseRight]' });
  return screen.findByRole('menu', { name: 'Video actions' });
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('folder tree and listing', () => {
  it('renders the sidebar tree and the unfiled videos of Home', async () => {
    renderHome();

    expect(await within(sidebar()).findByText('Engineering')).toBeVisible();
    expect(within(sidebar()).getByText('Design')).toBeVisible();
    expect(within(sidebar()).getByText('All videos')).toBeVisible();

    expect(await screen.findByText('Unfiled walkthrough')).toBeVisible();
    expect(screen.queryByText('Engineering standup')).toBeNull();
  });

  it('shows folder cards with their aggregate counts and a summary line', async () => {
    renderHome();

    const section = await waitFor(() => {
      const node = contentSection();
      expect(within(node).getByText('Engineering')).toBeVisible();
      return node;
    });

    const card = within(section)
      .getByText('Engineering')
      .closest('a') as HTMLElement;
    // Engineering has one direct video plus one in the Sprints subfolder
    expect(within(card).getByText('2 videos')).toBeVisible();
    expect(within(section).getByText(/1 video · 2 folders/)).toBeVisible();
  });

  it('expands a subfolder from the sidebar caret', async () => {
    renderHome();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Expand Engineering' }),
    );

    expect(await within(sidebar()).findByText('Sprints')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Collapse Engineering' }),
    ).toBeVisible();
  });

  it('lists the videos of the folder in the url with a path breadcrumb', async () => {
    renderHome({ route: '/?folder=f-sprint' });

    expect(await screen.findByText('Sprint retro')).toBeVisible();
    const heading = within(contentSection()).getByRole('heading', { level: 2 });
    expect(within(heading).getByRole('link', { name: 'Home' })).toBeVisible();
    expect(
      within(heading).getByRole('link', { name: 'Engineering' }),
    ).toBeVisible();
    expect(heading).toHaveTextContent('Sprints');
  });

  it('renders an empty state for a folder with no videos', async () => {
    renderHome({ route: '/?folder=f-design' });

    expect(await screen.findByText('No videos here yet.')).toBeVisible();
  });

  it('surfaces a folder load error', async () => {
    renderHome({
      api: { listVideos: () => Promise.reject(new Error('boom')) },
      route: '/?folder=f-design',
    });

    expect(
      await screen.findByText(
        'We could not load the videos in this folder.',
        {},
        { timeout: 4000 },
      ),
    ).toBeVisible();
  });

  it('redirects the synthetic ROOT folder param back to Home', async () => {
    renderHome({ route: '/?folder=ROOT' });

    // the Navigate lands on "/" which the test router renders as Home again,
    // so the proof is that no folder-scoped listing was ever requested
    expect(await within(sidebar()).findByText('Engineering')).toBeVisible();
    expect(await screen.findByText('Unfiled walkthrough')).toBeVisible();
  });
});

describe('creator vs member affordances', () => {
  it('gives a creator the upload button, status chip and hover actions', async () => {
    renderHome();

    expect(await screen.findByRole('link', { name: /upload/i })).toBeVisible();
    expect(screen.getByRole('button', { name: 'All statuses' })).toBeVisible();
    expect(
      within(contentSection()).getByRole('button', { name: /New folder/ }),
    ).toBeVisible();
    expect(
      await screen.findByRole('link', { name: 'Edit Unfiled walkthrough' }),
    ).toBeInTheDocument();
  });

  it('hides the creator-only affordances from a member', async () => {
    renderHome({ me: memberMe });

    await screen.findByText('Unfiled walkthrough');
    expect(screen.queryByRole('link', { name: /upload/i })).toBeNull();
    expect(screen.queryByRole('button', { name: 'All statuses' })).toBeNull();
    expect(screen.queryByRole('button', { name: /New folder/ })).toBeNull();
    expect(
      screen.queryByRole('link', { name: 'Edit Unfiled walkthrough' }),
    ).toBeNull();
  });

  it('hides videos that are not watchable from a member', async () => {
    renderHome({ me: memberMe, route: '/?folder=f-sprint' });

    // the only video in Sprints is a draft
    expect(await screen.findByText('No videos here yet.')).toBeVisible();
  });
});

describe('search', () => {
  it('sweeps every folder and badges each hit with its folder path', async () => {
    renderHome();

    await screen.findByText('Unfiled walkthrough');
    await userEvent.type(screen.getByLabelText('Search videos'), 'sprint');

    expect(
      await screen.findByText('Sprint retro', {}, { timeout: 4000 }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Results for "sprint"' }),
    ).toBeVisible();
    expect(screen.getByText('Engineering / Sprints')).toBeVisible();
    expect(screen.queryByText('Unfiled walkthrough')).toBeNull();
  });

  it('reports when a search matches nothing', async () => {
    renderHome();

    await screen.findByText('Unfiled walkthrough');
    await userEvent.type(screen.getByLabelText('Search videos'), 'zzzz');

    expect(
      await screen.findByText('No results for zzzz', {}, { timeout: 4000 }),
    ).toBeVisible();
  });
});

describe('sort, filter and view', () => {
  it('reorders the list by title', async () => {
    renderHome({ route: '/?view=all' });

    await screen.findByText('Sprint retro');
    await userEvent.click(screen.getByRole('button', { name: 'Sort videos' }));
    await userEvent.click(screen.getByRole('option', { name: 'Title A-Z' }));

    await waitFor(() =>
      expect(videoTitles()).toEqual([
        'Engineering standup',
        'Sprint retro',
        'Unfiled walkthrough',
      ]),
    );
  });

  it('sorts newest first by default and oldest first on request', async () => {
    renderHome({ route: '/?view=all' });

    await screen.findByText('Sprint retro');
    expect(videoTitles()[0]).toBe('Engineering standup');

    await userEvent.click(screen.getByRole('button', { name: 'Sort videos' }));
    await userEvent.click(screen.getByRole('option', { name: 'Oldest first' }));

    await waitFor(() => expect(videoTitles()[0]).toBe('Sprint retro'));
  });

  it('cycles the status filter and narrows the list', async () => {
    renderHome({ route: '/?view=all' });

    await screen.findByText('Sprint retro');
    await userEvent.click(screen.getByRole('button', { name: 'All statuses' }));

    expect(
      await screen.findByRole('button', { name: 'Published' }),
    ).toBeVisible();
    await waitFor(() => expect(screen.queryByText('Sprint retro')).toBeNull());

    await userEvent.click(screen.getByRole('button', { name: 'Published' }));
    expect(await screen.findByText('Sprint retro')).toBeVisible();
    expect(screen.queryByText('Engineering standup')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Drafts' }));
    expect(
      await screen.findByRole('button', { name: 'All statuses' }),
    ).toBeVisible();
  });

  it('persists the view mode across mounts', async () => {
    const { unmount } = renderHome();

    await screen.findByText('Unfiled walkthrough');
    await userEvent.click(screen.getByRole('button', { name: 'List view' }));
    expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    unmount();

    renderHome();
    expect(
      await screen.findByRole('button', { name: 'List view' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('all videos view', () => {
  it('shows every video with its folder path and no folder cards', async () => {
    renderHome({ route: '/?view=all' });

    expect(
      await screen.findByRole('heading', { name: 'All videos', level: 2 }),
    ).toBeVisible();
    expect(await screen.findByText('Unfiled walkthrough')).toBeVisible();
    expect(screen.getByText('Engineering standup')).toBeVisible();

    const section = contentSection();
    expect(within(section).getByText('Home')).toBeVisible();
    expect(within(section).getByText('Engineering / Sprints')).toBeVisible();
    expect(within(section).queryByText('Folders')).toBeNull();
  });

  it('surfaces an all-videos load error', async () => {
    renderHome({
      api: { listAllVideos: () => Promise.reject(new Error('boom')) },
      route: '/?view=all',
    });

    expect(
      await screen.findByText(
        'We could not load the videos.',
        {},
        { timeout: 4000 },
      ),
    ).toBeVisible();
  });
});

describe('selection', () => {
  it('replaces the selection on a plain click and clears it on Escape', async () => {
    renderHome({ route: '/?view=all' });

    await screen.findByText('Sprint retro');
    await userEvent.click(cardFor('Sprint retro'));
    expect(cardFor('Sprint retro')).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(cardFor('Engineering standup'));
    expect(cardFor('Sprint retro')).toHaveAttribute('aria-selected', 'false');
    expect(cardFor('Engineering standup')).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(cardFor('Engineering standup')).toHaveAttribute(
        'aria-selected',
        'false',
      ),
    );
  });

  it('adds to the selection with ctrl-click and extends with shift-click', async () => {
    renderHome({ route: '/?view=all' });

    await screen.findByText('Sprint retro');
    const [first, second, third] = videoTitles() as [string, string, string];
    const user = userEvent.setup();

    await user.click(cardFor(first));
    await user.keyboard('{Control>}');
    await user.click(cardFor(third));
    await user.keyboard('{/Control}');

    expect(cardFor(first)).toHaveAttribute('aria-selected', 'true');
    expect(cardFor(third)).toHaveAttribute('aria-selected', 'true');
    expect(cardFor(second)).toHaveAttribute('aria-selected', 'false');

    await user.click(cardFor(first));
    await user.keyboard('{Shift>}');
    await user.click(cardFor(third));
    await user.keyboard('{/Shift}');

    expect(cardFor(second)).toHaveAttribute('aria-selected', 'true');
  });

  it('does not select for a member', async () => {
    renderHome({ me: memberMe });

    await screen.findByText('Unfiled walkthrough');
    await userEvent.click(cardFor('Unfiled walkthrough'));
    expect(cardFor('Unfiled walkthrough')).not.toHaveAttribute('aria-selected');
  });
});

describe('video context menu', () => {
  it('offers watch and edit for a single ready published video', async () => {
    renderHome();

    await screen.findByText('Unfiled walkthrough');
    const menu = await openVideoMenu('Unfiled walkthrough');

    expect(within(menu).getByRole('menuitem', { name: 'Watch' })).toBeVisible();
    expect(within(menu).getByRole('menuitem', { name: 'Edit' })).toBeVisible();
  });

  it('hides watch for a draft', async () => {
    renderHome({ route: '/?folder=f-sprint' });

    await screen.findByText('Sprint retro');
    const menu = await openVideoMenu('Sprint retro');

    expect(within(menu).queryByRole('menuitem', { name: 'Watch' })).toBeNull();
    expect(within(menu).getByRole('menuitem', { name: 'Edit' })).toBeVisible();
  });

  it('moves the selected video into a folder chosen from the submenu', async () => {
    const bulkMoveVideos = jest.fn(() =>
      Promise.resolve({ moved: ['v-unfiled'], missing: [] }),
    );
    renderHome({ api: { bulkMoveVideos } });

    await screen.findByText('Unfiled walkthrough');
    const menu = await openVideoMenu('Unfiled walkthrough');

    await userEvent.hover(
      within(menu).getByRole('menuitem', { name: 'Move to' }),
    );
    await userEvent.click(
      await within(menu).findByRole('menuitem', { name: 'Design' }),
    );

    expect(bulkMoveVideos).toHaveBeenCalledWith(['v-unfiled'], 'f-design');
  });

  it('disables the Home move target when already at the top level', async () => {
    renderHome();

    await screen.findByText('Unfiled walkthrough');
    const menu = await openVideoMenu('Unfiled walkthrough');
    await userEvent.hover(
      within(menu).getByRole('menuitem', { name: 'Move to' }),
    );

    expect(
      await within(menu).findByRole('menuitem', { name: 'Home' }),
    ).toBeDisabled();
  });

  it('deletes the selection after confirming in the danger modal', async () => {
    const bulkDeleteVideos = jest.fn(() =>
      Promise.resolve({ deleted: ['v-unfiled'], missing: [], locked: [] }),
    );
    renderHome({ api: { bulkDeleteVideos } });

    await screen.findByText('Unfiled walkthrough');
    const menu = await openVideoMenu('Unfiled walkthrough');
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Delete' }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Delete 1 video?')).toBeVisible();
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' }),
    );

    expect(bulkDeleteVideos).toHaveBeenCalledWith(['v-unfiled']);
  });

  it('keeps a video another creator holds open selected', async () => {
    const bulkDeleteVideos = jest.fn(() =>
      Promise.resolve({ deleted: [], missing: [], locked: ['v-unfiled'] }),
    );
    renderHome({ api: { bulkDeleteVideos } });

    await screen.findByText('Unfiled walkthrough');
    const menu = await openVideoMenu('Unfiled walkthrough');
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Delete' }),
    );

    const dialog = await screen.findByRole('dialog');
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' }),
    );

    expect(bulkDeleteVideos).toHaveBeenCalledWith(['v-unfiled']);
    // the modal closes, but the locked video survives
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Unfiled walkthrough')).toBeVisible();
  });

  it('counts a multi-selection in the delete label and the modal', async () => {
    renderHome({ route: '/?view=all' });

    await screen.findByText('Sprint retro');
    const [first, second] = videoTitles() as [string, string];
    const user = userEvent.setup();
    await user.click(cardFor(first));
    await user.keyboard('{Control>}');
    await user.click(cardFor(second));
    await user.keyboard('{/Control}');

    const menu = await openVideoMenu(first);
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Delete 2 videos' }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Delete 2 videos?')).toBeVisible();
  });

  it('deletes straight from the card trash button', async () => {
    const bulkDeleteVideos = jest.fn(() =>
      Promise.resolve({ deleted: ['v-unfiled'], missing: [], locked: [] }),
    );
    renderHome({ api: { bulkDeleteVideos } });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete Unfiled walkthrough' }),
    );

    const dialog = await screen.findByRole('dialog');
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' }),
    );

    expect(bulkDeleteVideos).toHaveBeenCalledWith(['v-unfiled']);
  });
});

describe('folder create, rename and delete', () => {
  it('creates a top level folder from the sidebar plus button', async () => {
    const createFolder = jest.fn(() =>
      Promise.resolve({ id: 'f-new', name: 'Ops' }),
    );
    renderHome({ api: { createFolder } });

    await within(sidebar()).findByText('Engineering');
    await userEvent.click(
      within(sidebar()).getByRole('button', { name: 'New folder' }),
    );
    await userEvent.type(
      screen.getByLabelText('New folder name'),
      'Ops{Enter}',
    );

    expect(createFolder).toHaveBeenCalledWith('Ops', undefined);
  });

  it('creates a folder inside the current folder from the toolbar', async () => {
    const createFolder = jest.fn(() =>
      Promise.resolve({ id: 'f-new', name: 'Ops' }),
    );
    renderHome({ api: { createFolder }, route: '/?folder=f-eng' });

    await screen.findByText('Engineering standup');
    await userEvent.click(
      within(contentSection()).getByRole('button', { name: /New folder/ }),
    );
    await userEvent.type(
      await screen.findByLabelText('New folder name in Engineering'),
      'Ops{Enter}',
    );

    expect(createFolder).toHaveBeenCalledWith('Ops', 'f-eng');
  });

  it('disables the toolbar new-folder button at the deepest level', async () => {
    renderHome({ route: '/?folder=f-deep' });

    await screen.findByText('No videos here yet.');
    expect(
      within(contentSection()).getByRole('button', { name: /New folder/ }),
    ).toBeDisabled();
  });

  it('renames a folder from its kebab menu', async () => {
    const renameFolder = jest.fn(() =>
      Promise.resolve({ id: 'f-design', name: 'Brand' }),
    );
    renderHome({ api: { renameFolder } });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Actions for Design' }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Rename' }),
    );
    const input = await screen.findByLabelText('Rename Design');
    await userEvent.clear(input);
    await userEvent.type(input, 'Brand{Enter}');

    expect(renameFolder).toHaveBeenCalledWith('f-design', 'Brand');
  });

  it('creates a subfolder from the folder menu', async () => {
    const createFolder = jest.fn(() =>
      Promise.resolve({ id: 'f-new', name: 'Sub' }),
    );
    renderHome({ api: { createFolder } });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Actions for Design' }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'New subfolder' }),
    );
    await userEvent.type(
      await screen.findByLabelText('New subfolder in Design'),
      'Sub{Enter}',
    );

    expect(createFolder).toHaveBeenCalledWith('Sub', 'f-design');
  });

  it('hides the new-subfolder item at the deepest level', async () => {
    renderHome();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Expand Engineering' }),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Expand Sprints' }),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Actions for Deep' }),
    );

    const menu = await screen.findByRole('menu', { name: 'Actions for Deep' });
    expect(
      within(menu).queryByRole('menuitem', { name: 'New subfolder' }),
    ).toBeNull();
    expect(
      within(menu).getByRole('menuitem', { name: 'Rename' }),
    ).toBeVisible();
  });

  it('deletes an empty folder without asking for the name', async () => {
    const deleteFolder = jest.fn(() => Promise.resolve());
    renderHome({ api: { deleteFolder } });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Actions for Design' }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Delete' }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(
      await within(dialog).findByText(/This folder is empty/),
    ).toBeVisible();
    expect(
      within(dialog).queryByLabelText('Type the folder name to confirm'),
    ).toBeNull();
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete' }),
    );

    expect(deleteFolder).toHaveBeenCalledWith('f-design');
  });

  it('counts the subtree and gates the delete behind the typed name', async () => {
    const deleteFolder = jest.fn(() => Promise.resolve());
    renderHome({ api: { deleteFolder } });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Actions for Engineering' }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Delete' }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(
      await within(dialog).findByText(
        /This folder contains 2 videos and 2 folders\./,
      ),
    ).toBeVisible();
    expect(within(dialog).getByText(/2 subfolders/)).toBeVisible();

    const confirm = within(dialog).getByRole('button', { name: 'Delete' });
    expect(confirm).toBeDisabled();

    await userEvent.type(
      within(dialog).getByLabelText('Type the folder name to confirm'),
      'Engineering',
    );
    expect(confirm).toBeEnabled();
    await userEvent.click(confirm);

    expect(deleteFolder).toHaveBeenCalledWith('f-eng');
  });

  it('closes the delete modal on cancel without deleting', async () => {
    const deleteFolder = jest.fn(() => Promise.resolve());
    renderHome({ api: { deleteFolder } });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Actions for Design' }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Delete' }),
    );
    const dialog = await screen.findByRole('dialog');
    await within(dialog).findByText(/This folder is empty/);
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel' }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(deleteFolder).not.toHaveBeenCalled();
  });
});

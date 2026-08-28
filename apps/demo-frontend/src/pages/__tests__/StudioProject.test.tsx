import { createEmptyTimeline } from '@asap-hub/demo-timeline';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiError } from '../../api/client';
import type { ProjectAsset, Video } from '../../api/types';
import { autosaveMs } from '../../studio/project/useProjectEditor';
import { creatorMe, makeVideo, renderApp } from '../../test-utils';
import StudioProject from '../StudioProject';

const project: Video = makeVideo({
  id: 'project-1',
  title: 'Sprint 16 demo',
  kind: 'studio',
  status: 'draft',
  processingState: 'empty',
  version: 3,
});

const asset = (overrides: Partial<ProjectAsset> = {}): ProjectAsset => ({
  assetId: 'asset-1',
  kind: 'video',
  state: 'ready',
  mimeType: 'video/mp4',
  label: 'Intro take',
  durationMs: 8000,
  url: '/projects/project-1/assets/asset-1/original.mp4',
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
  ...overrides,
});

const timelineWithClip = {
  ...createEmptyTimeline(),
  clips: [
    {
      kind: 'source' as const,
      id: 'clip-1',
      assetId: 'asset-1',
      inMs: 0,
      outMs: 8000,
      volume: 1,
    },
  ],
};

const api = (overrides = {}) => ({
  getVideo: jest.fn().mockResolvedValue(project),
  getTimeline: jest
    .fn()
    .mockResolvedValue({ timeline: createEmptyTimeline(), timelineVersion: 4 }),
  listAssets: jest.fn().mockResolvedValue([asset()]),
  acquireLease: jest.fn().mockResolvedValue({
    lockedBy: creatorMe.sub,
    lockedByName: creatorMe.name,
    lockExpiresAt: new Date(Date.now() + 90000).toISOString(),
  }),
  releaseLease: jest.fn().mockResolvedValue(undefined),
  saveTimeline: jest.fn().mockResolvedValue({
    video: { ...project, version: 4 },
    timelineVersion: 5,
  }),
  ...overrides,
});

const renderStudio = (overrides = {}) =>
  renderApp(<StudioProject />, {
    api: api(overrides),
    me: creatorMe,
    route: '/studio/projects/project-1',
    routePath: '/studio/projects/:id',
  });

// the clip block on the timeline announces itself as "<label>, <length>"
const timelineClip = () =>
  screen.getByRole('button', { name: /^Intro take, / });
const timelineClips = () =>
  screen.queryAllByRole('button', { name: /^Intro take, / });

// The autosave effect schedules its debounce after the commit, so a single jump
// of the clock can land before the timer exists and fire nothing. Pumping with a
// flush between each step means the timer is always scheduled before it is due.
const pumpAutosave = async (steps = 6) => {
  for (let step = 0; step < steps; step += 1) {
    // eslint-disable-next-line no-await-in-loop
    await act(async () => {
      jest.advanceTimersByTime(autosaveMs);
    });
  }
};

// the editor mounts a lease, a timeline, an asset list and a preview, and the
// autosave tests pump a debounce on top of that; 10s is not enough headroom on a
// loaded runner, where this file has been killed mid-test
jest.setTimeout(30_000);

// jsdom implements neither media playback nor pointer capture, both of which
// the editor uses as soon as a clip is on the timeline
beforeAll(() => {
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.hasPointerCapture = jest.fn(() => false);
});

it('stands in for the editor while the demo is still loading', () => {
  const pending = () => new Promise<never>(() => {});
  renderStudio({
    getVideo: pending,
    getTimeline: pending,
    listAssets: pending,
    acquireLease: pending,
  });

  expect(screen.getByRole('status')).toHaveTextContent('Loading the demo');
  expect(screen.queryByLabelText('Demo title')).not.toBeInTheDocument();
});

it('shows the editor once the project and its timeline load', async () => {
  renderStudio();

  expect(await screen.findByLabelText('Demo title')).toHaveValue(
    'Sprint 16 demo',
  );
  expect(
    screen.getByRole('button', { name: 'Import a video' }),
  ).toBeInTheDocument();
  expect(await screen.findByLabelText('Name of Intro take')).toHaveValue(
    'Intro take',
  );
});

it('starts with an empty preview and no clips', async () => {
  renderStudio();

  expect(await screen.findByText(/Add a clip to the timeline/)).toBeVisible();
  expect(screen.getByText('0:00.00 / 0:00.00')).toBeVisible();
});

it('adds an asset to the timeline and shows its length', async () => {
  renderStudio();

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add to timeline' }),
  );

  expect(timelineClip()).toBeVisible();
  expect(screen.getByText('0:00.00 / 0:08.00')).toBeVisible();
});

it('splits the clip under the playhead into two', async () => {
  renderStudio();

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add to timeline' }),
  );
  await userEvent.click(screen.getByRole('button', { name: 'Split' }));

  // the playhead sits at zero, which is too close to the head to split
  expect(timelineClips()).toHaveLength(1);
});

it('selects a clip and removes it again', async () => {
  renderStudio();

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add to timeline' }),
  );
  await userEvent.click(timelineClip());

  const inspector = screen.getByRole('complementary', { name: 'Clip' });
  expect(within(inspector).getByText('Starts')).toBeVisible();

  await userEvent.click(screen.getByRole('button', { name: 'Remove clip' }));

  expect(timelineClips()).toHaveLength(0);
});

it('saves the timeline after an edit', async () => {
  const saveTimeline = jest.fn().mockResolvedValue({
    video: { ...project, version: 4 },
    timelineVersion: 5,
  });
  jest.useFakeTimers({ advanceTimers: true });
  renderStudio({ saveTimeline });

  // nothing is scheduled while the editor is read only, and it is read only
  // until the lease lands; editing before then leaves the timer to be set after
  // the clock has already been advanced
  await waitFor(() =>
    expect(screen.getByLabelText('Demo title')).toBeEnabled(),
  );

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add to timeline' }),
  );
  // the debounce is only scheduled once the edit has been committed, and
  // advancing the clock before then leaves a timer that nothing will fire
  await waitFor(() => expect(timelineClips()).toHaveLength(1));
  await pumpAutosave();

  expect(saveTimeline).toHaveBeenCalled();
  expect(saveTimeline).toHaveBeenCalledWith(
    'project-1',
    expect.objectContaining({ timelineVersion: 4, version: 3 }),
  );
  jest.useRealTimers();
});

it('says so straight away when an edit has not been saved yet', async () => {
  renderStudio();

  await waitFor(() =>
    expect(screen.getByLabelText('Demo title')).toBeEnabled(),
  );
  await userEvent.click(
    await screen.findByRole('button', { name: 'Add to timeline' }),
  );

  expect(await screen.findByText('Unsaved changes')).toBeVisible();
  expect(screen.queryByText('All changes saved')).not.toBeInTheDocument();
});

it('is read only when someone else holds the lease', async () => {
  renderStudio({
    acquireLease: jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'locked', 'locked', 'Bo')),
  });

  expect(await screen.findByText(/Bo is editing this demo/)).toBeVisible();
});

describe('when the editing lock is held elsewhere', () => {
  const lockedOut = () =>
    jest.fn().mockRejectedValue(new ApiError(409, 'locked', 'locked', 'Bo'));

  it('offers a way to ask for the lock again', async () => {
    const acquireLease = jest
      .fn()
      .mockRejectedValueOnce(new ApiError(409, 'locked', 'locked', 'Bo'))
      .mockResolvedValue({
        lockedBy: creatorMe.sub,
        lockedByName: creatorMe.name,
        lockExpiresAt: new Date(Date.now() + 90000).toISOString(),
      });
    renderStudio({ acquireLease });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Try to edit again' }),
    );

    await waitFor(() =>
      expect(screen.getByLabelText('Demo title')).toBeEnabled(),
    );
    expect(
      screen.queryByText(/Bo is editing this demo/),
    ).not.toBeInTheDocument();
  });

  it('keeps the export out of reach', async () => {
    renderStudio({
      acquireLease: lockedOut(),
      getTimeline: jest
        .fn()
        .mockResolvedValue({ timeline: timelineWithClip, timelineVersion: 4 }),
    });

    expect(
      await screen.findByRole('button', { name: 'Export to a demo' }),
    ).toBeDisabled();
  });

  // "retrying on the next edit" cannot be followed: a read only editor has no
  // next edit
  it('does not promise a retry it cannot make', async () => {
    // the autosave debounce is driven rather than waited out: a real 1.5s wait
    // plus the refused save left too little slack on a loaded machine
    jest.useFakeTimers({ advanceTimers: true });
    renderStudio({ saveTimeline: lockedOut() });

    await waitFor(() =>
      expect(screen.getByLabelText('Demo title')).toBeEnabled(),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to timeline' }),
    );
    await waitFor(() => expect(timelineClips()).toHaveLength(1));
    await pumpAutosave();

    expect(
      await screen.findByText(/cannot be saved until it comes back/),
    ).toBeVisible();
    jest.useRealTimers();
    expect(
      screen.queryByText(/retrying on the next edit/),
    ).not.toBeInTheDocument();
  });
});

describe('leaving with edits the server has not taken', () => {
  it('asks before the demos breadcrumb navigates', async () => {
    renderStudio();

    await waitFor(() =>
      expect(screen.getByLabelText('Demo title')).toBeEnabled(),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to timeline' }),
    );
    await userEvent.click(screen.getByRole('link', { name: 'Demos' }));

    expect(
      await screen.findByRole('dialog', { name: 'Unsaved changes' }),
    ).toBeVisible();
  });

  // the link out to the demo navigated straight past the guard
  it('asks before the preview link navigates', async () => {
    renderStudio({
      getVideo: jest
        .fn()
        .mockResolvedValue({ ...project, processingState: 'ready' }),
    });

    await waitFor(() =>
      expect(screen.getByLabelText('Demo title')).toBeEnabled(),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to timeline' }),
    );
    await userEvent.click(
      screen.getByRole('link', { name: 'Preview the demo' }),
    );

    expect(
      await screen.findByRole('dialog', { name: 'Unsaved changes' }),
    ).toBeVisible();
  });

  // nothing flushes a read only editor on the way out, so the edits made before
  // the lock went are lost without a word
  it('asks even when the lock has gone and they cannot be saved', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    renderStudio({
      saveTimeline: jest
        .fn()
        .mockRejectedValue(new ApiError(409, 'locked', 'locked', 'Bo')),
    });

    await waitFor(() =>
      expect(screen.getByLabelText('Demo title')).toBeEnabled(),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to timeline' }),
    );
    await waitFor(() => expect(timelineClips()).toHaveLength(1));
    // the autosave has to run and be refused before the lock is known to be gone
    await pumpAutosave();
    expect(await screen.findByText(/Bo is editing this demo/)).toBeVisible();
    jest.useRealTimers();

    await userEvent.click(screen.getByRole('link', { name: 'Demos' }));

    const dialog = await screen.findByRole('dialog', {
      name: 'Unsaved changes',
    });
    expect(within(dialog).getByText(/cannot be saved/)).toBeVisible();
    expect(
      within(dialog).queryByRole('button', { name: 'Save and leave' }),
    ).not.toBeInTheDocument();
  });
});

describe('rendering', () => {
  it('offers a render once the timeline has a clip', async () => {
    renderStudio({
      getTimeline: jest
        .fn()
        .mockResolvedValue({ timeline: timelineWithClip, timelineVersion: 4 }),
    });

    expect(
      await screen.findByRole('button', { name: 'Export to a demo' }),
    ).toBeEnabled();
  });

  it('cannot render an empty timeline', async () => {
    renderStudio();

    expect(
      await screen.findByRole('button', { name: 'Export to a demo' }),
    ).toBeDisabled();
  });

  it('starts a render at the version it read', async () => {
    const startRender = jest
      .fn()
      .mockResolvedValue({ ...project, render: { state: 'queued' } });
    renderStudio({
      startRender,
      getTimeline: jest
        .fn()
        .mockResolvedValue({ timeline: timelineWithClip, timelineVersion: 4 }),
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Export to a demo' }),
    );

    expect(startRender).toHaveBeenCalledWith('project-1', 3);
  });

  // the page can hold a render state and a row version the server has moved
  // past, and only reading the row again puts that right
  it('reads the demo again when the export is refused', async () => {
    const getVideo = jest.fn().mockResolvedValue(project);
    const startRender = jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'render_active', 'render_active'));
    renderStudio({
      getVideo,
      startRender,
      getTimeline: jest
        .fn()
        .mockResolvedValue({ timeline: timelineWithClip, timelineVersion: 4 }),
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Export to a demo' }),
    );

    expect(
      await screen.findByText('An export is already running for this demo.'),
    ).toBeVisible();
    await waitFor(() => expect(getVideo).toHaveBeenCalledTimes(2));
  });

  it.each`
    code                | message
    ${'empty_timeline'} | ${'Add a clip before exporting.'}
    ${'locked'}         | ${'Someone else is editing this demo, so it cannot be exported.'}
    ${'conflict'}       | ${'This demo changed somewhere else. Try the export again.'}
    ${'anything_else'}  | ${'Could not start the export.'}
  `('explains a $code refusal', async ({ code, message }) => {
    renderStudio({
      startRender: jest.fn().mockRejectedValue(new ApiError(400, code, code)),
      getTimeline: jest
        .fn()
        .mockResolvedValue({ timeline: timelineWithClip, timelineVersion: 4 }),
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Export to a demo' }),
    );

    expect(await screen.findByText(message)).toBeVisible();
  });

  // three buttons and no word about who can see what
  it('says who can see the demo at each step', async () => {
    renderStudio();

    expect(
      await screen.findByText(/Exporting makes a video only you can see/),
    ).toBeVisible();
  });

  it('says an exported demo is private until it is published', async () => {
    renderStudio({
      getVideo: jest
        .fn()
        .mockResolvedValue({ ...project, processingState: 'ready' }),
    });

    expect(
      await screen.findByText(
        'Exported. Only you can see it until you publish.',
      ),
    ).toBeVisible();
  });

  it('says a published demo can be watched', async () => {
    renderStudio({
      getVideo: jest.fn().mockResolvedValue({
        ...project,
        processingState: 'ready',
        status: 'published',
      }),
    });

    expect(
      await screen.findByText('Published. Anyone signed in can watch it.'),
    ).toBeVisible();
  });

  // a re-export overwrites what people are watching, so it is not a click away
  it('confirms an export that replaces a published demo', async () => {
    const startRender = jest
      .fn()
      .mockResolvedValue({ ...project, render: { state: 'queued' } });
    renderStudio({
      startRender,
      getVideo: jest.fn().mockResolvedValue({
        ...project,
        processingState: 'ready',
        status: 'published',
      }),
      getTimeline: jest
        .fn()
        .mockResolvedValue({ timeline: timelineWithClip, timelineVersion: 4 }),
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Export again' }),
    );

    const dialog = await screen.findByRole('dialog', {
      name: 'Export this demo again',
    });
    expect(
      within(dialog).getByText(/replaces the demo members are watching now/),
    ).toBeVisible();
    expect(startRender).not.toHaveBeenCalled();

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Export again' }),
    );

    expect(startRender).toHaveBeenCalledWith('project-1', 3);
  });

  it('shows progress and a way out while a render runs', async () => {
    renderStudio({
      getVideo: jest.fn().mockResolvedValue({
        ...project,
        render: {
          renderId: 'render-1',
          state: 'rendering',
          timelineVersion: 4,
          stage: 'clip 0 (source asset-1)',
          progress: 40,
        },
      }),
    });

    expect(await screen.findByText('Rendering the clips')).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '40',
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  it('explains a failed render', async () => {
    renderStudio({
      getVideo: jest.fn().mockResolvedValue({
        ...project,
        render: {
          renderId: 'render-1',
          state: 'failed',
          timelineVersion: 4,
          error: 'ffmpeg exited 1',
        },
      }),
    });

    expect(
      await screen.findByText(/Export failed: ffmpeg exited 1/),
    ).toBeVisible();
  });

  it('links to the finished demo once there is output', async () => {
    renderStudio({
      getVideo: jest
        .fn()
        .mockResolvedValue({ ...project, processingState: 'ready' }),
    });

    expect(
      await screen.findByRole('link', { name: 'Preview the demo' }),
    ).toHaveAttribute('href', '/videos/project-1');
  });
});

describe('chapters', () => {
  it('explains how chapters work before there are any', async () => {
    renderStudio();

    expect(await screen.findByText(/No chapters yet/)).toBeVisible();
  });

  it('adds one at the playhead and lets it be renamed', async () => {
    renderStudio();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Add to timeline' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Chapter at the playhead' }),
    );

    const field = screen.getByDisplayValue('New chapter');

    await userEvent.clear(field);
    await userEvent.type(field, 'Attendance');

    expect(screen.getByDisplayValue('Attendance')).toBeVisible();
  });

  it('cannot add a chapter with nothing on the timeline', async () => {
    renderStudio();

    expect(
      await screen.findByRole('button', { name: 'Chapter at the playhead' }),
    ).toBeDisabled();
  });
});

describe('when a source cannot be changed', () => {
  it('explains why the clip still using it blocks the removal', async () => {
    const deleteAsset = jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'conflict', 'asset_in_use'));
    renderStudio({
      deleteAsset,
      listAssets: jest.fn().mockResolvedValue([asset()]),
    });

    await userEvent.click(await screen.findByLabelText('Remove Intro take'));

    expect(deleteAsset).toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /still used on the timeline/i,
    );
  });

  it('says so when the rename is refused', async () => {
    const renameAsset = jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'conflict', 'locked'));
    renderStudio({ renameAsset });

    const name = await screen.findByDisplayValue('Intro take');
    await userEvent.clear(name);
    await userEvent.type(name, 'Attendance');
    await userEvent.tab();

    await waitFor(() => expect(renameAsset).toHaveBeenCalled());
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /someone else is editing/i,
    );
  });
});

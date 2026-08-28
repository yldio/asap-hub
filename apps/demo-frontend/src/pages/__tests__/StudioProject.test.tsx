import { createEmptyTimeline } from '@asap-hub/demo-timeline';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiError } from '../../api/client';
import type { ProjectAsset, Video } from '../../api/types';
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

// jsdom implements neither media playback nor pointer capture, both of which
// the editor uses as soon as a clip is on the timeline
beforeAll(() => {
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.hasPointerCapture = jest.fn(() => false);
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
  await act(async () => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => expect(saveTimeline).toHaveBeenCalled());
  expect(saveTimeline).toHaveBeenCalledWith(
    'project-1',
    expect.objectContaining({ timelineVersion: 4, version: 3 }),
  );
  jest.useRealTimers();
});

it('is read only when someone else holds the lease', async () => {
  renderStudio({
    acquireLease: jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'locked', 'locked', 'Bo')),
  });

  expect(await screen.findByText(/Bo is editing this demo/)).toBeVisible();
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

  it('shows progress and a way out while a render runs', async () => {
    renderStudio({
      getVideo: jest.fn().mockResolvedValue({
        ...project,
        render: {
          renderId: 'render-1',
          state: 'rendering',
          timelineVersion: 4,
          stage: 'clips',
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

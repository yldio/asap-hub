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

  expect(await screen.findByText('Sprint 16 demo')).toBeVisible();
  expect(
    screen.getByRole('button', { name: 'Import a video' }),
  ).toBeInTheDocument();
  expect(await screen.findByText('Intro take')).toBeVisible();
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

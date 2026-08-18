import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Video, VideoAccess } from '../../api/types';
import { memberMe, renderApp } from '../../test-utils';
import Watch from '../Watch';

const video: Video = {
  id: 'video-1',
  title: 'Sprint 42 demo',
  status: 'published',
  folderId: 'folder-1',
  recordedAt: '2026-08-14T09:00:00.000Z',
  durationMs: 1800000,
  chapters: [
    { startMs: 0, title: 'Intro' },
    { startMs: 561000, title: 'Event attendance' },
  ],
  processingState: 'ready',
  createdBy: { sub: 'auth0|2', name: 'Sam Creator' },
  version: 1,
};

const access: VideoAccess = {
  streamUrl: '/media/video-1/stream.mp4',
  spriteUrl: '/media/video-1/sprite.jpg',
  thumbnailsVttUrl: '/media/video-1/thumbnails.vtt',
};

const api = {
  getVideo: () => Promise.resolve(video),
  requestAccess: () => Promise.resolve(access),
  listFolders: () => Promise.resolve([]),
};

beforeEach(() => {
  window.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, text: () => Promise.resolve('WEBVTT\n') }),
  ) as unknown as typeof fetch;
});

it('seeks the player to the chapter start when a chapter is clicked', async () => {
  renderApp(<Watch />, {
    api,
    me: memberMe,
    route: '/videos/video-1',
    routePath: '/videos/:id',
  });

  const player = (await screen.findByTestId('demo-video')) as HTMLVideoElement;
  const setCurrentTime = jest.fn();
  Object.defineProperty(player, 'currentTime', {
    get: () => 0,
    set: setCurrentTime,
    configurable: true,
  });

  await userEvent.click(
    screen.getByRole('button', { name: /event attendance/i }),
  );

  expect(setCurrentTime).toHaveBeenCalledWith(561);
});

it('shows a processing state instead of the player while encoding', async () => {
  renderApp(<Watch />, {
    api: {
      ...api,
      getVideo: () =>
        Promise.resolve({ ...video, processingState: 'processing' }),
    },
    me: memberMe,
    route: '/videos/video-1',
    routePath: '/videos/:id',
  });

  expect(
    await screen.findByText('This demo is still processing'),
  ).toBeVisible();
  expect(screen.queryByTestId('demo-video')).not.toBeInTheDocument();
});

it('offers a retry when playback access fails', async () => {
  renderApp(<Watch />, {
    api: { ...api, requestAccess: () => Promise.reject(new Error('403')) },
    me: memberMe,
    route: '/videos/video-1',
    routePath: '/videos/:id',
  });

  expect(await screen.findByText('Playback is not available')).toBeVisible();
  expect(screen.getByRole('button', { name: /retry/i })).toBeVisible();
});

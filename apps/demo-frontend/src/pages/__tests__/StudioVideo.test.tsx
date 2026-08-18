import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiError } from '../../api/client';
import type { Me, Video, VideoAccess } from '../../api/types';
import { renderApp } from '../../test-utils';
import StudioVideo from '../StudioVideo';

const creatorMe: Me = {
  sub: 'auth0|2',
  name: 'Sam Creator',
  email: 'sam@example.com',
  role: 'creator',
};

const video: Video = {
  id: 'video-1',
  title: 'Sprint 42 demo',
  status: 'draft',
  folderId: 'ROOT',
  recordedAt: '2026-08-14T09:00:00.000Z',
  durationMs: 600000,
  chapters: [],
  processingState: 'ready',
  createdBy: { sub: 'auth0|2', name: 'Sam Creator' },
  version: 3,
};

const access: VideoAccess = {
  streamUrl: '/media/video-1/stream.mp4',
  spriteUrl: '/media/video-1/sprite.jpg',
  thumbnailsVttUrl: '/media/video-1/thumbnails.vtt',
};

const baseApi = {
  getVideo: () => Promise.resolve(video),
  requestAccess: () => Promise.resolve(access),
  listFolders: () => Promise.resolve([]),
  acquireLease: () =>
    Promise.resolve({
      lockedBy: 'auth0|2',
      lockedByName: 'Sam Creator',
      lockExpiresAt: '2026-08-18T10:00:00.000Z',
    }),
  releaseLease: () => Promise.resolve(),
  releaseLeaseOnUnload: () => {},
  updateVideo: jest.fn(() => Promise.resolve({ ...video, version: 4 })),
};

const renderEditor = (api: Partial<typeof baseApi> = {}) =>
  renderApp(<StudioVideo />, {
    api: { ...baseApi, ...api },
    me: creatorMe,
    route: '/studio/videos/video-1',
    routePath: '/studio/videos/:id',
  });

const setPlayhead = (seconds: number) => {
  const player = screen.getByTestId('studio-video') as HTMLVideoElement;
  Object.defineProperty(player, 'currentTime', {
    get: () => seconds,
    set: () => {},
    configurable: true,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('marks a chapter at the playhead and snaps the first one to zero', async () => {
  renderEditor();

  await screen.findByTestId('studio-video');
  setPlayhead(120);

  await userEvent.keyboard('m');

  const first = await screen.findByLabelText('Start time of chapter 1');
  expect(first).toHaveValue('0:00');
});

it('keeps marked chapters sorted by start time', async () => {
  renderEditor({
    getVideo: () =>
      Promise.resolve({
        ...video,
        chapters: [
          { startMs: 0, title: 'Intro' },
          { startMs: 300000, title: 'Later' },
        ],
      }),
  });

  await screen.findByTestId('studio-video');
  setPlayhead(120);

  await userEvent.keyboard('m');

  await waitFor(() =>
    expect(screen.getByLabelText('Start time of chapter 2')).toHaveValue(
      '2:00',
    ),
  );
  expect(screen.getByLabelText('Start time of chapter 3')).toHaveValue('5:00');
});

it('does not reorder rows while a timecode field is focused', async () => {
  renderEditor({
    getVideo: () =>
      Promise.resolve({
        ...video,
        chapters: [
          { startMs: 0, title: 'Intro' },
          { startMs: 60000, title: 'Second' },
          { startMs: 120000, title: 'Third' },
        ],
      }),
  });

  const third = await screen.findByLabelText('Start time of chapter 3');
  await userEvent.clear(third);
  await userEvent.type(third, '0:30');

  expect(screen.getByLabelText('Title of chapter 3')).toHaveValue('Third');
  expect(screen.getByLabelText('Title of chapter 2')).toHaveValue('Second');

  await userEvent.tab();

  await waitFor(() =>
    expect(screen.getByLabelText('Title of chapter 2')).toHaveValue('Third'),
  );
  expect(screen.getByLabelText('Title of chapter 3')).toHaveValue('Second');
});

it('shows an inline error for an unparseable timecode and does not save it', async () => {
  const updateVideo = jest.fn(() => Promise.resolve({ ...video, version: 4 }));
  renderEditor({
    updateVideo,
    getVideo: () =>
      Promise.resolve({ ...video, chapters: [{ startMs: 0, title: 'Intro' }] }),
  });

  const start = await screen.findByLabelText('Start time of chapter 1');
  await userEvent.clear(start);
  await userEvent.type(start, 'not a time');

  expect(await screen.findByText('Use mm:ss or hh:mm:ss')).toBeVisible();
  expect(updateVideo).not.toHaveBeenCalled();
});

describe('with a debounced autosave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const user = () =>
    userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  it('saves chapters with the current version and adopts the version from the response', async () => {
    const updateVideo = jest
      .fn()
      .mockResolvedValueOnce({ ...video, version: 4 })
      .mockResolvedValueOnce({ ...video, version: 5 });

    renderEditor({ updateVideo });
    const events = user();

    await screen.findByTestId('studio-video');
    setPlayhead(90);
    await events.keyboard('m');

    await events.type(
      await screen.findByLabelText('Title of chapter 1'),
      'Intro',
    );

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    await waitFor(() => expect(updateVideo).toHaveBeenCalledTimes(1));
    expect(updateVideo.mock.calls[0]?.[1]).toMatchObject({
      version: 3,
      chapters: [{ startMs: 0, title: 'Intro' }],
    });

    await events.type(screen.getByLabelText('Title of chapter 1'), ' updated');

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    await waitFor(() => expect(updateVideo).toHaveBeenCalledTimes(2));
    expect(updateVideo.mock.calls[1]?.[1]).toMatchObject({ version: 4 });
  });

  it('coalesces rapid edits into a single save', async () => {
    const updateVideo = jest.fn(() =>
      Promise.resolve({ ...video, version: 4 }),
    );

    renderEditor({ updateVideo });
    const events = user();

    await screen.findByTestId('studio-video');
    setPlayhead(90);
    await events.keyboard('m');

    await events.type(
      await screen.findByLabelText('Title of chapter 1'),
      'Introduction',
    );

    expect(updateVideo).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    await waitFor(() => expect(updateVideo).toHaveBeenCalledTimes(1));
  });
});

it('renders a read-only banner naming the lease holder on 409', async () => {
  renderEditor({
    acquireLease: () =>
      Promise.reject(new ApiError(409, 'locked', 'locked', 'Ada Lovelace')),
  });

  expect(await screen.findByText(/Being edited by Ada Lovelace/)).toBeVisible();
  expect(screen.getByTestId('studio-video')).toBeVisible();
  expect(screen.getByLabelText('Video title')).toBeDisabled();
});

it('switches to a lost-lease state when a save is rejected as locked', async () => {
  const updateVideo = jest
    .fn()
    .mockRejectedValue(new ApiError(409, 'locked', 'locked', 'Ada Lovelace'));

  renderEditor({ updateVideo });

  await screen.findByTestId('studio-video');
  setPlayhead(30);
  await userEvent.keyboard('m');

  const start = await screen.findByLabelText('Start time of chapter 1');
  await userEvent.click(start);
  await userEvent.tab();

  expect(
    await screen.findByText(/edit lease was taken over by Ada Lovelace/),
  ).toBeVisible();
});

it('shows a processing screen instead of the editor while encoding', async () => {
  renderEditor({
    getVideo: () =>
      Promise.resolve({ ...video, processingState: 'processing' as const }),
  });

  expect(
    await screen.findByText('This demo is still processing'),
  ).toBeVisible();
  expect(screen.queryByTestId('studio-video')).not.toBeInTheDocument();
});

it('surfaces the processing error when encoding failed', async () => {
  renderEditor({
    getVideo: () =>
      Promise.resolve({
        ...video,
        processingState: 'failed' as const,
        processingError: 'ffmpeg exited with 1',
      }),
  });

  expect(await screen.findByText('ffmpeg exited with 1')).toBeVisible();
});

it('confirms before publishing and sends the current version', async () => {
  const publishVideo = jest.fn(() =>
    Promise.resolve({ ...video, status: 'published' as const, version: 4 }),
  );
  renderEditor({ publishVideo } as Partial<typeof baseApi>);

  await screen.findByTestId('studio-video');
  await userEvent.click(screen.getByRole('button', { name: 'Publish' }));

  const dialog = await screen.findByRole('dialog');
  expect(within(dialog).getByText(/Sprint 42 demo/)).toBeVisible();

  await userEvent.click(
    within(dialog).getByRole('button', { name: 'Publish' }),
  );

  await waitFor(() => expect(publishVideo).toHaveBeenCalledWith('video-1', 3));
});

it('redirects a member away from the editor', async () => {
  renderApp(<StudioVideo />, {
    api: baseApi,
    me: { ...creatorMe, role: 'member' },
    route: '/studio/videos/video-1',
    routePath: '*',
  });

  await waitFor(() =>
    expect(screen.queryByTestId('studio-video')).not.toBeInTheDocument(),
  );
  expect(screen.queryByLabelText('Video title')).not.toBeInTheDocument();
});

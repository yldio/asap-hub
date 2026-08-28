import { createEmptyTimeline } from '@asap-hub/demo-timeline';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { TestApiProvider } from '../../../api/ApiProvider';
import { ApiError } from '../../../api/client';
import type { Api } from '../../../api/client';
import { AuthContext, AuthState } from '../../../auth/AuthProvider';
import { authenticatedState, makeVideo } from '../../../test-utils';
import { autosaveMs, useProjectEditor } from '../useProjectEditor';

const project = makeVideo({ id: 'project-1', kind: 'studio', version: 3 });

const addClip = (assetId: string, clipId: string) => ({
  type: 'addClip' as const,
  assetId,
  clipId,
  durationMs: 5000,
});

const renderEditor = (api: Partial<Api>, onLeaseLost = jest.fn()) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={authenticatedState as AuthState}>
      <TestApiProvider api={api}>{children}</TestApiProvider>
    </AuthContext.Provider>
  );
  const view = renderHook(
    () =>
      useProjectEditor({
        id: 'project-1',
        timeline: createEmptyTimeline(),
        timelineVersion: 4,
        version: 3,
        readOnly: false,
        onLeaseLost,
      }),
    { wrapper },
  );
  return { view, onLeaseLost };
};

const settle = async () => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, autosaveMs + 150);
    });
  });
};

describe('saving', () => {
  it('sends the versions it was given', async () => {
    const saveTimeline = jest.fn().mockResolvedValue({
      video: { ...project, version: 4 },
      timelineVersion: 5,
    });
    const { view } = renderEditor({ saveTimeline });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    await settle();

    expect(saveTimeline).toHaveBeenCalledWith(
      'project-1',
      expect.objectContaining({ timelineVersion: 4, version: 3 }),
    );
  });

  // A save queued behind another one runs inside the first one's `finally`,
  // before React has re-rendered, so reading the versions from state sent the
  // one the server had already moved past and everything after it was a 409.
  it('carries the versions the last save returned into the next one', async () => {
    const saveTimeline = jest
      .fn()
      .mockResolvedValueOnce({
        video: { ...project, version: 4 },
        timelineVersion: 5,
      })
      .mockResolvedValueOnce({
        video: { ...project, version: 5 },
        timelineVersion: 6,
      });
    const { view } = renderEditor({ saveTimeline });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    await settle();
    act(() => view.result.current.dispatch(addClip('asset-2', 'clip-2')));
    await settle();

    await waitFor(() => expect(saveTimeline).toHaveBeenCalledTimes(2));
    expect(saveTimeline).toHaveBeenLastCalledWith(
      'project-1',
      expect.objectContaining({ timelineVersion: 5, version: 4 }),
    );
  });

  it('takes both versions from the server after a conflict', async () => {
    const saveTimeline = jest
      .fn()
      .mockRejectedValueOnce(new ApiError(409, 'conflict', 'conflict'))
      .mockResolvedValue({
        video: { ...project, version: 9 },
        timelineVersion: 25,
      });
    const getVideo = jest.fn().mockResolvedValue({
      ...project,
      version: 8,
      timeline: {
        key: 'k',
        timelineVersion: 24,
        schemaVersion: 1,
        updatedAt: '2026-08-28T00:00:00.000Z',
      },
    });
    const { view } = renderEditor({ saveTimeline, getVideo });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    await settle();

    await waitFor(() => expect(saveTimeline).toHaveBeenCalledTimes(2));
    // rebasing only the row version left the timeline version stale, so the
    // retry conflicted exactly as the first attempt had
    expect(saveTimeline).toHaveBeenLastCalledWith(
      'project-1',
      expect.objectContaining({ timelineVersion: 24, version: 8 }),
    );
  });

  it('does not retry on a conflict that leaves the versions where they were', async () => {
    const saveTimeline = jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'conflict', 'conflict'));
    const getVideo = jest.fn().mockResolvedValue({
      ...project,
      timeline: {
        key: 'k',
        timelineVersion: 4,
        schemaVersion: 1,
        updatedAt: '2026-08-28T00:00:00.000Z',
      },
    });
    const { view } = renderEditor({ saveTimeline, getVideo });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    await settle();

    expect(saveTimeline).toHaveBeenCalledTimes(1);
    expect(view.result.current.saveState).toBe('error');
  });

  it('reports a lost lease rather than rebasing', async () => {
    const saveTimeline = jest
      .fn()
      .mockRejectedValue(new ApiError(409, 'locked', 'locked', 'Bo'));
    const { view, onLeaseLost } = renderEditor({ saveTimeline });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    await settle();

    await waitFor(() => expect(onLeaseLost).toHaveBeenCalledWith('Bo'));
  });
});

describe('dirty', () => {
  it('is clean until something is edited', () => {
    const { view } = renderEditor({ saveTimeline: jest.fn() });

    expect(view.result.current.dirty).toBe(false);
  });

  it('reports an edit the server has not taken yet', () => {
    const { view } = renderEditor({ saveTimeline: jest.fn() });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));

    expect(view.result.current.dirty).toBe(true);
  });

  it('is clean again once the save lands', async () => {
    const saveTimeline = jest.fn().mockResolvedValue({
      video: { ...project, version: 4 },
      timelineVersion: 5,
    });
    const { view } = renderEditor({ saveTimeline });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    await settle();

    await waitFor(() => expect(view.result.current.dirty).toBe(false));
  });
});

describe('discard', () => {
  // the flush on the way out would otherwise save the very edits the creator
  // just chose to abandon
  it('gives up the pending edits so nothing further is sent', async () => {
    const saveTimeline = jest.fn().mockResolvedValue({
      video: { ...project, version: 4 },
      timelineVersion: 5,
    });
    const { view } = renderEditor({ saveTimeline });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    act(() => view.result.current.discard());

    expect(view.result.current.dirty).toBe(false);
    await settle();
    expect(saveTimeline).not.toHaveBeenCalled();
  });

  it('leaves the timeline on screen alone', () => {
    const { view } = renderEditor({ saveTimeline: jest.fn() });

    act(() => view.result.current.dispatch(addClip('asset-1', 'clip-1')));
    act(() => view.result.current.discard());

    expect(view.result.current.timeline.clips).toHaveLength(1);
  });
});

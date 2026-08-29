import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { TestApiProvider } from '../../../api/ApiProvider';
import type { Api } from '../../../api/client';
import { AuthContext, AuthState } from '../../../auth/AuthProvider';
import { authenticatedState } from '../../../test-utils';
import { useCursorCapture } from '../useCursorCapture';

const session = {
  sessionId: 'session-1',
  token: 'token-1',
  snippetUrl: 'http://localhost/capture/v1.js#project.project-1.first',
  bookmarkReady: false,
  captureUrl: 'http://localhost/capture',
  expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
};

const open = { state: 'open' as const, eventCount: 42, clientCount: 1 };

const render = (api: Partial<Api>) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={authenticatedState as AuthState}>
      <TestApiProvider api={api}>{children}</TestApiProvider>
    </AuthContext.Provider>
  );
  return renderHook(() => useCursorCapture('project-1'), { wrapper });
};

beforeEach(() => window.localStorage.clear());

// a reload used to strand every event already captured: no session meant no
// status, and no status disabled the button that applies them
it('finds the session again after a reload', async () => {
  const startCapture = jest.fn().mockResolvedValue(session);
  const captureStatus = jest.fn().mockResolvedValue(open);

  const first = render({ startCapture, captureStatus });
  first.result.current.start();
  await waitFor(() => expect(first.result.current.session).toEqual(session));
  first.unmount();

  const second = render({ startCapture, captureStatus });

  expect(second.result.current.session).toEqual(session);
  await waitFor(() => expect(second.result.current.status).toEqual(open));
  expect(startCapture).toHaveBeenCalledTimes(1);
});

it('lets go of a session the server no longer has', async () => {
  window.localStorage.setItem(
    'demo-hub.capture.project-1',
    JSON.stringify(session),
  );
  const captureStatus = jest.fn().mockRejectedValue(new Error('gone'));

  const view = render({ captureStatus });

  await waitFor(() => expect(view.result.current.session).toBeUndefined());
  expect(window.localStorage.getItem('demo-hub.capture.project-1')).toBeNull();
});

// the bookmark is handed out the once it is minted, so a creator who lost
// theirs asks for another and has to be shown it in the panel they are looking at
it('keeps a replacement bookmark on the session it is showing', async () => {
  const startCapture = jest.fn().mockResolvedValue({
    ...session,
    snippetUrl: undefined,
    bookmarkReady: true,
  });
  const captureStatus = jest.fn().mockResolvedValue(open);
  const newCaptureBookmark = jest.fn().mockResolvedValue({
    snippetUrl: 'http://localhost/capture/v1.js#project.project-1.second',
    captureUrl: 'http://localhost/capture',
  });

  const view = render({ startCapture, captureStatus, newCaptureBookmark });
  await act(async () => view.result.current.start());
  await waitFor(() => expect(view.result.current.session).toBeDefined());

  await act(async () => view.result.current.newBookmark());

  await waitFor(() =>
    expect(view.result.current.session?.snippetUrl).toBe(
      'http://localhost/capture/v1.js#project.project-1.second',
    ),
  );
  // and it survives the reload the panel used to lose it on
  expect(window.localStorage.getItem('demo-hub.capture.project-1')).toContain(
    'project-1.second',
  );
});

it('reports a bookmark it could not replace', async () => {
  const startCapture = jest.fn().mockResolvedValue(session);
  const captureStatus = jest.fn().mockResolvedValue(open);
  const newCaptureBookmark = jest.fn().mockRejectedValue(new Error('nope'));

  const view = render({ startCapture, captureStatus, newCaptureBookmark });
  await act(async () => view.result.current.start());
  await waitFor(() => expect(view.result.current.session).toBeDefined());

  await act(async () => view.result.current.newBookmark());

  await waitFor(() =>
    expect(view.result.current.error).toBe(
      'Could not make a new capture bookmark.',
    ),
  );
  expect(view.result.current.session?.snippetUrl).toBe(session.snippetUrl);
});

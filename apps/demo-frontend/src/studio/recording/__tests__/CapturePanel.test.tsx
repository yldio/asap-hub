import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecordingSession } from '../../../api/types';
import CapturePanel from '../CapturePanel';

const session: RecordingSession = {
  sessionId: 'session-1',
  token: 'token-1',
  snippetUrl: 'http://localhost:3500/capture/v1.js#project.project-1.secret',
  bookmarkReady: false,
  captureUrl: 'http://localhost:3500/api/capture',
  expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
};

const panel = (props: Partial<Parameters<typeof CapturePanel>[0]> = {}) =>
  render(
    <CapturePanel
      readOnly={false}
      applying={false}
      onStart={jest.fn()}
      onNewBookmark={jest.fn()}
      onApply={jest.fn()}
      {...props}
    />,
  );

it('says the bookmark is set up once before a session is started', () => {
  panel();

  expect(
    screen.getByText(/set up once and reused by every recording/i),
  ).toBeVisible();
});

it('offers the project bookmark when it has just been minted', () => {
  panel({ session });

  expect(screen.getByText(/the same bookmark keeps working/i)).toBeVisible();
  const snippet = screen.getByLabelText(
    'Capture snippet',
  ) as HTMLTextAreaElement;
  expect(snippet.value).toContain(session.snippetUrl);
});

// the bug the reusable bookmark fixes: a second recording used to hand out a
// new snippet, so the creator rebuilt their bookmark every time
it('has nothing new to copy for a project that already has one', () => {
  panel({
    session: { ...session, snippetUrl: undefined, bookmarkReady: true },
  });

  expect(screen.queryByLabelText('Capture snippet')).not.toBeInTheDocument();
  expect(screen.getByText(/already has a capture bookmark/i)).toBeVisible();
});

it('asks for another bookmark only when the creator says they lost it', async () => {
  const onNewBookmark = jest.fn();
  panel({
    session: { ...session, snippetUrl: undefined, bookmarkReady: true },
    onNewBookmark,
  });

  expect(screen.getByText(/replaces the one you saved before/i)).toBeVisible();
  await userEvent.click(
    screen.getByRole('button', { name: 'Show a new bookmark' }),
  );

  expect(onNewBookmark).toHaveBeenCalled();
});

// "waiting" on its own left the creator watching a panel that never changed
it('tells the creator what to click while no events have arrived', () => {
  panel({ session, status: { state: 'open', eventCount: 0, clientCount: 0 } });

  expect(
    screen.getByText(/click your capture bookmark on the tab you are demoing/i),
  ).toBeVisible();
  expect(
    screen.getByRole('button', { name: 'Add cursor effects' }),
  ).toBeDisabled();
});

it('shows what has arrived once it has', () => {
  panel({ session, status: { state: 'open', eventCount: 42, clientCount: 2 } });

  expect(screen.getByText('2 tabs connected, 42 events')).toBeVisible();
  expect(
    screen.getByRole('button', { name: 'Add cursor effects' }),
  ).toBeEnabled();
});

it('renders an error from the capture', () => {
  panel({ session, error: 'Could not make a new capture bookmark.' });

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Could not make a new capture bookmark.',
  );
});

describe('a capture that has already been used', () => {
  // the session closes when its effects are taken, so a second recording needs
  // its own; without this the next take was given the first take's clicks
  const closed = { state: 'closed' as const, eventCount: 143, clientCount: 0 };
  const open = { state: 'open' as const, eventCount: 143, clientCount: 1 };

  it('offers another capture for the next recording', async () => {
    const onStart = jest.fn();
    panel({ session, status: closed, onStart });

    await userEvent.click(
      screen.getByRole('button', { name: 'Track the cursor again' }),
    );

    expect(onStart).toHaveBeenCalled();
  });

  it('says why another one is needed', () => {
    panel({ session, status: closed });

    expect(screen.getByText(/has been used/i)).toBeVisible();
  });

  it('does not offer one while the capture is still running', () => {
    panel({ session, status: open });

    expect(
      screen.queryByRole('button', { name: 'Track the cursor again' }),
    ).not.toBeInTheDocument();
  });
});

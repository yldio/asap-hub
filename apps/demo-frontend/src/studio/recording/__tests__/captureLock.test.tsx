import { render, screen } from '@testing-library/react';
import { FC } from 'react';
import RecorderPanel from '../RecorderPanel';
import VoiceOverPanel from '../VoiceOverPanel';
import { releaseCapture } from '../captureLock';
import { RecorderStatus } from '../useScreenRecorder';

afterEach(() => releaseCapture());

const Both: FC<{ readonly screen: RecorderStatus }> = ({ screen: status }) => (
  <>
    <RecorderPanel
      status={status}
      elapsedMs={1000}
      withMicrophone
      readOnly={false}
      onMicrophoneChange={jest.fn()}
      onStart={jest.fn()}
      onPause={jest.fn()}
      onResume={jest.fn()}
      onStop={jest.fn()}
    />
    <VoiceOverPanel
      status="idle"
      elapsedMs={0}
      saving={false}
      readOnly={false}
      onStart={jest.fn()}
      onStop={jest.fn()}
    />
  </>
);

describe('while a screen recording is running', () => {
  // both of these want the microphone and both put something on the timeline,
  // and every one of them stayed clickable mid take
  it('a voice over cannot be started on top of it', () => {
    render(<Both screen="recording" />);

    expect(
      screen.getByRole('button', { name: 'Record a voice over' }),
    ).toBeDisabled();
  });

  it('says which recording is in the way', () => {
    render(<Both screen="recording" />);

    expect(
      screen.getByRole('button', { name: 'Record a voice over' }),
    ).toHaveAttribute('title', 'A screen recording is already running');
  });
});

describe('with nothing recording', () => {
  it('a voice over can be started', () => {
    render(<Both screen="idle" />);

    expect(
      screen.getByRole('button', { name: 'Record a voice over' }),
    ).toBeEnabled();
  });

  it('the lock is given up when the take finishes', () => {
    const view = render(<Both screen="recording" />);
    view.rerender(<Both screen="idle" />);

    expect(
      screen.getByRole('button', { name: 'Record a voice over' }),
    ).toBeEnabled();
  });
});

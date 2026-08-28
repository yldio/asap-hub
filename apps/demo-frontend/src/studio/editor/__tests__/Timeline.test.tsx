import { layoutClips, Timeline as TimelineDoc } from '@asap-hub/demo-timeline';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectAsset } from '../../../api/types';
import Timeline from '../Timeline';

const asset = (assetId: string, label: string): ProjectAsset => ({
  assetId,
  kind: 'video',
  state: 'ready',
  mimeType: 'video/mp4',
  label,
  durationMs: 20000,
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
});

const clips: TimelineDoc['clips'] = [
  {
    kind: 'source',
    id: 'clip-a',
    assetId: 'asset-a',
    inMs: 0,
    outMs: 4000,
    volume: 1,
  },
  {
    kind: 'source',
    id: 'clip-b',
    assetId: 'asset-b',
    inMs: 0,
    outMs: 6000,
    volume: 1,
  },
];

const pixelsPerSecond = 100;

const renderTimeline = (overrides: Record<string, unknown> = {}) => {
  const onMove = jest.fn();
  const onTrim = jest.fn();
  const onSeek = jest.fn();
  const onSelect = jest.fn();
  const onSelectBanner = jest.fn();
  const onMoveBanner = jest.fn();
  const onToggleMute = jest.fn();
  const placements = layoutClips(clips);

  render(
    <Timeline
      placements={placements}
      durationMs={10000}
      playheadMs={0}
      pixelsPerSecond={pixelsPerSecond}
      readOnly={false}
      banners={[]}
      onSelectBanner={onSelectBanner}
      onMoveBanner={onMoveBanner}
      assets={{
        'asset-a': asset('asset-a', 'A'),
        'asset-b': asset('asset-b', 'B'),
      }}
      onSelect={onSelect}
      onSeek={onSeek}
      onMove={onMove}
      onTrim={onTrim}
      onToggleMute={onToggleMute}
      {...overrides}
    />,
  );

  return {
    onMove,
    onTrim,
    onSeek,
    onSelect,
    onSelectBanner,
    onMoveBanner,
    onToggleMute,
  };
};

// the lane is positioned by the browser; jsdom reports zeroes unless told
const stubLaneGeometry = () => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 1000,
    bottom: 100,
    width: 1000,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
};

// jsdom implements neither PointerEvent nor pointer capture, so without these
// the drag handlers never see a coordinate
class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props);
    this.pointerId = props.pointerId ?? 1;
  }
}

beforeAll(() => {
  window.PointerEvent = TestPointerEvent as unknown as typeof PointerEvent;
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.hasPointerCapture = jest.fn(() => true);
});

beforeEach(() => {
  stubLaneGeometry();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const clipBlock = (name: string) =>
  screen.getByRole('button', { name: new RegExp(`^${name}, `) });

describe('dragging a clip', () => {
  it('reorders it when it is dropped past the next clip', () => {
    const { onMove } = renderTimeline();

    // clip A occupies 0..400px, clip B 400..1000px; dropping at 800px is past
    // the midpoint of B, so A should land after it
    fireEvent.pointerDown(clipBlock('A'), { pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(clipBlock('A'), { pointerId: 1, clientX: 800 });
    fireEvent.pointerUp(clipBlock('A'), { pointerId: 1, clientX: 800 });

    expect(onMove).toHaveBeenCalledWith('clip-a', 1);
  });

  it('leaves the order alone when it is dropped where it started', () => {
    const { onMove } = renderTimeline();

    fireEvent.pointerDown(clipBlock('A'), { pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(clipBlock('A'), { pointerId: 1, clientX: 150 });
    fireEvent.pointerUp(clipBlock('A'), { pointerId: 1, clientX: 150 });

    expect(onMove).not.toHaveBeenCalled();
  });

  it('does not reorder while the project is read only', () => {
    const { onMove } = renderTimeline({ readOnly: true });

    fireEvent.pointerDown(clipBlock('A'), { pointerId: 1, clientX: 100 });
    fireEvent.pointerMove(clipBlock('A'), { pointerId: 1, clientX: 800 });
    fireEvent.pointerUp(clipBlock('A'), { pointerId: 1, clientX: 800 });

    expect(onMove).not.toHaveBeenCalled();
  });
});

describe('dragging a trim handle', () => {
  it('shortens the end of a clip when dragged left', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the end of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 400 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 300 });

    expect(onTrim).toHaveBeenCalledWith('clip-a', { outMs: 3000 });
  });

  it('extends the end of a clip again when dragged back right', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the end of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 400 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 600 });

    expect(onTrim).toHaveBeenCalledWith('clip-a', { outMs: 6000 });
  });

  it('moves the start of a clip', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the start of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100 });

    expect(onTrim).toHaveBeenCalledWith('clip-a', { inMs: 1000 });
  });
});

describe('the ruler', () => {
  it('seeks to the position that was clicked', () => {
    const { onSeek } = renderTimeline();

    fireEvent.pointerDown(screen.getByRole('presentation'), {
      pointerId: 1,
      clientX: 250,
    });

    expect(onSeek).toHaveBeenCalledWith(2500);
  });
});

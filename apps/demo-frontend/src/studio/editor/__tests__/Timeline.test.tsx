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

const banner: TimelineDoc['banners'][number] = {
  id: 'banner-a',
  startMs: 2000,
  durationMs: 2000,
  preset: 'lowerThird',
  text: 'Hello',
  position: 'bottom',
  animation: 'fade',
};

const zoom: TimelineDoc['zooms'][number] = {
  id: 'zoom-a',
  clipId: 'clip-b',
  startMs: 1000,
  rampInMs: 400,
  holdMs: 1200,
  rampOutMs: 400,
  focus: { x: 0.5, y: 0.5 },
  scale: 2,
  easing: 'easeInOut',
};

const narration: TimelineDoc['narration'][number] = {
  id: 'take-a',
  assetId: 'asset-a',
  startMs: 1000,
  inMs: 0,
  outMs: 3000,
  volume: 1,
};

const pixelsPerSecond = 100;

const renderTimeline = (overrides: Record<string, unknown> = {}) => {
  const onMove = jest.fn();
  const onTrim = jest.fn();
  const onSeek = jest.fn();
  const onSelect = jest.fn();
  const onSpanChange = jest.fn();
  const onToggleMute = jest.fn();
  const onGestureStart = jest.fn();
  const onGestureEnd = jest.fn();
  const placements = layoutClips(clips);

  const view = render(
    <Timeline
      placements={placements}
      durationMs={10000}
      playheadMs={0}
      pixelsPerSecond={pixelsPerSecond}
      readOnly={false}
      banners={[]}
      narration={[]}
      zooms={[]}
      cursorLayers={[]}
      assets={{
        'asset-a': asset('asset-a', 'A'),
        'asset-b': asset('asset-b', 'B'),
      }}
      onSelect={onSelect}
      onSeek={onSeek}
      onMove={onMove}
      onTrim={onTrim}
      onSpanChange={onSpanChange}
      onToggleMute={onToggleMute}
      onGestureStart={onGestureStart}
      onGestureEnd={onGestureEnd}
      {...overrides}
    />,
  );

  return {
    container: view.container,
    onMove,
    onTrim,
    onSeek,
    onSelect,
    onSpanChange,
    onToggleMute,
    onGestureStart,
    onGestureEnd,
  };
};

// the move handler ignores a pointer with nothing held, so every drag frame in
// these tests has to say a button is down
const pointerMove = (
  element: Element,
  init: { pointerId: number; clientX: number },
) => fireEvent.pointerMove(element, { ...init, buttons: 1 });

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
    pointerMove(clipBlock('A'), { pointerId: 1, clientX: 800 });
    fireEvent.pointerUp(clipBlock('A'), { pointerId: 1, clientX: 800 });

    expect(onMove).toHaveBeenCalledWith('clip-a', 1);
  });

  it('leaves the order alone when it is dropped where it started', () => {
    const { onMove } = renderTimeline();

    fireEvent.pointerDown(clipBlock('A'), { pointerId: 1, clientX: 100 });
    pointerMove(clipBlock('A'), { pointerId: 1, clientX: 150 });
    fireEvent.pointerUp(clipBlock('A'), { pointerId: 1, clientX: 150 });

    expect(onMove).not.toHaveBeenCalled();
  });

  it('does not reorder while the project is read only', () => {
    const { onMove } = renderTimeline({ readOnly: true });

    fireEvent.pointerDown(clipBlock('A'), { pointerId: 1, clientX: 100 });
    pointerMove(clipBlock('A'), { pointerId: 1, clientX: 800 });
    fireEvent.pointerUp(clipBlock('A'), { pointerId: 1, clientX: 800 });

    expect(onMove).not.toHaveBeenCalled();
  });
});

describe('dragging a trim handle', () => {
  it('shortens the end of a clip when dragged left', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the end of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 400 });
    pointerMove(handle, { pointerId: 1, clientX: 300 });

    expect(onTrim).toHaveBeenCalledWith('clip-a', { outMs: 3000 });
  });

  it('extends the end of a clip again when dragged back right', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the end of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 400 });
    pointerMove(handle, { pointerId: 1, clientX: 600 });

    expect(onTrim).toHaveBeenCalledWith('clip-a', { outMs: 6000 });
  });

  it('moves the start of a clip', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the start of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 });
    pointerMove(handle, { pointerId: 1, clientX: 100 });

    expect(onTrim).toHaveBeenCalledWith('clip-a', { inMs: 1000 });
  });

  // the handle used to be measured against the block's own edge, which moves as
  // the trim lands, so every frame added the offset again and the clip could
  // only ever shrink
  it('follows the pointer back and forth within one drag', () => {
    const { onTrim } = renderTimeline();

    const handle = screen.getByRole('button', { name: 'Trim the end of A' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 400 });
    pointerMove(handle, { pointerId: 1, clientX: 300 });
    pointerMove(handle, { pointerId: 1, clientX: 700 });
    pointerMove(handle, { pointerId: 1, clientX: 400 });

    expect(onTrim).toHaveBeenLastCalledWith('clip-a', { outMs: 4000 });
  });
});

describe('the overlay lanes', () => {
  it('moves a banner along its lane', () => {
    const { onSpanChange } = renderTimeline({ banners: [banner] });

    const block = screen.getByRole('button', { name: 'Banner Hello' });
    fireEvent.pointerDown(block, { pointerId: 1, clientX: 250 });
    pointerMove(block, { pointerId: 1, clientX: 450 });

    expect(onSpanChange).toHaveBeenCalledWith(
      'banner',
      'banner-a',
      { startMs: 4000, durationMs: 2000 },
      'move',
    );
  });

  it('lengthens a banner from its end', () => {
    const { onSpanChange } = renderTimeline({ banners: [banner] });

    const handle = screen.getByRole('button', {
      name: 'Drag to change where Banner Hello ends',
    });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 400 });
    pointerMove(handle, { pointerId: 1, clientX: 700 });

    expect(onSpanChange).toHaveBeenCalledWith(
      'banner',
      'banner-a',
      { startMs: 2000, durationMs: 5000 },
      'trimEnd',
    );
  });

  it('resizes a zoom in programme time, past the clip it belongs to', () => {
    const { onSpanChange } = renderTimeline({ zooms: [zoom] });

    // clip B starts at 4000ms, so the zoom sits at 5000ms and runs for 2000ms
    const handle = screen.getByRole('button', {
      name: 'Drag to change where Zoom 2x ends',
    });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 700 });
    pointerMove(handle, { pointerId: 1, clientX: 900 });

    expect(onSpanChange).toHaveBeenCalledWith(
      'zoom',
      'zoom-a',
      { startMs: 5000, durationMs: 4000 },
      'trimEnd',
    );
  });

  // dragging the left edge right used to push the zoom's end later, because the
  // lane stopped at the shortest block rather than at the zoom's own ramps
  it('never lets a zoom end later than it did when its start is trimmed', () => {
    const { onSpanChange } = renderTimeline({ zooms: [zoom] });

    const handle = screen.getByRole('button', {
      name: 'Drag to change where Zoom 2x starts',
    });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 500 });
    pointerMove(handle, { pointerId: 1, clientX: 700 });

    // the zoom runs 5000..7000; its ramps are 800 together, so its start can
    // only reach 6200 and its end has to stay where it was
    const [, , span] = onSpanChange.mock.calls.at(-1) ?? [];
    expect(span).toEqual({ startMs: 6200, durationMs: 800 });
  });

  it('moves a voice over take', () => {
    const { onSpanChange } = renderTimeline({ narration: [narration] });

    const block = screen.getByRole('button', { name: 'Voice over A' });
    fireEvent.pointerDown(block, { pointerId: 1, clientX: 150 });
    pointerMove(block, { pointerId: 1, clientX: 550 });

    expect(onSpanChange).toHaveBeenCalledWith(
      'narration',
      'take-a',
      { startMs: 5000, durationMs: 3000 },
      'move',
    );
  });

  it('selects a voice over take so it can be removed', () => {
    const { onSelect } = renderTimeline({ narration: [narration] });

    fireEvent.pointerDown(
      screen.getByRole('button', { name: 'Voice over A' }),
      {
        pointerId: 1,
        clientX: 150,
      },
    );

    expect(onSelect).toHaveBeenCalledWith('narration', 'take-a');
  });
});

describe('a title card', () => {
  const titled: TimelineDoc['clips'] = [
    {
      kind: 'title',
      id: 'title-a',
      durationMs: 3000,
      preset: 'centered',
      text: 'Intro',
    },
    ...clips,
  ];

  it('changes how long it stays on screen when its edge is dragged', () => {
    const { onSpanChange } = renderTimeline({
      placements: layoutClips(titled),
    });

    const handle = screen.getByRole('button', {
      name: 'Trim the end of Intro',
    });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 300 });
    pointerMove(handle, { pointerId: 1, clientX: 500 });

    expect(onSpanChange).toHaveBeenCalledWith(
      'title',
      'title-a',
      { startMs: 0, durationMs: 5000 },
      'trimEnd',
    );
  });
});

describe('a clip block', () => {
  // it used to print the source trim range rounded to whole seconds, under a
  // ruler showing programme time, so the two disagreed on every trimmed clip
  it('reads in the same time the ruler does', () => {
    renderTimeline({
      placements: layoutClips([
        { ...clips[0], inMs: 2500, outMs: 6000 } as (typeof clips)[number],
      ]),
    });

    expect(screen.getByRole('button', { name: /^A, / })).toHaveTextContent(
      '0:00.00–0:03.50',
    );
  });

  it('gives a clip shorter than a second a span with a width', () => {
    renderTimeline({
      placements: layoutClips([
        { ...clips[0], inMs: 6000, outMs: 6400 } as (typeof clips)[number],
      ]),
    });

    expect(screen.getByRole('button', { name: /^A, / })).toHaveTextContent(
      '0:00.00–0:00.40',
    );
  });

  // a 14px crossed speaker was the only sign a clip had been silenced
  it('says in words that a clip has been muted', () => {
    renderTimeline({
      placements: layoutClips([
        { ...clips[0], volume: 0 } as (typeof clips)[number],
      ]),
    });

    expect(
      screen.getByRole('button', { name: /^A, .*muted$/ }),
    ).toHaveTextContent('muted');
  });

  it('still says which part of the source it uses', () => {
    renderTimeline({
      placements: layoutClips([
        { ...clips[0], inMs: 2500, outMs: 6000 } as (typeof clips)[number],
      ]),
    });

    expect(screen.getByRole('button', { name: /^A, / })).toHaveAttribute(
      'title',
      'Uses 0:02.50 to 0:06.00 of A',
    );
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

describe('the track headers', () => {
  it('names every lane, in the order the lanes are drawn', () => {
    const { container } = renderTimeline();

    const headers = Array.from(
      container.querySelectorAll('[aria-hidden="true"] > div'),
    ).map((cell) => cell.textContent);

    // the first cell is the spacer beside the ruler; the rest must match the
    // lanes one for one or the tracks stop lining up with their names
    expect(headers).toEqual([
      '',
      'Clips',
      'Banners',
      'Zoom, cursor',
      'Voice over',
    ]);
  });
});

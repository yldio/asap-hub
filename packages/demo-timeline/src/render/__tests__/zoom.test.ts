import { Canvas, Zoom } from '../../schema';
import { clipZooms, zoomDurationMs, zoomFilters } from '../zoom';

const canvas: Canvas = { width: 1920, height: 1080, fps: 30 };

const zoom = (overrides: Partial<Zoom> = {}): Zoom => ({
  id: 'zoom-1',
  clipId: 'clip-1',
  startMs: 1000,
  rampInMs: 400,
  holdMs: 1500,
  rampOutMs: 400,
  focus: { x: 0.5, y: 0.5 },
  scale: 2,
  easing: 'easeInOut',
  ...overrides,
});

const graphOf = (zooms: Zoom[]): string => zoomFilters(zooms, canvas).join(',');

describe('zoomDurationMs', () => {
  it('is the two ramps and the hold between them', () => {
    expect(zoomDurationMs(zoom())).toBe(2300);
  });
});

describe('clipZooms', () => {
  it('keeps the zooms that belong to the clip', () => {
    expect(
      clipZooms(
        [zoom(), zoom({ id: 'zoom-2', clipId: 'clip-2' })],
        'clip-1',
      ).map(({ id }) => id),
    ).toEqual(['zoom-1']);
  });

  it.each([
    ['never leaves 1x', zoom({ scale: 1 })],
    ['has no time to ramp', zoom({ rampInMs: 0, holdMs: 0, rampOutMs: 0 })],
  ])('drops a zoom that %s', (_, unused) => {
    expect(clipZooms([unused], 'clip-1')).toEqual([]);
  });
});

describe('zoomFilters', () => {
  it('leaves a clip with no zoom untouched', () => {
    expect(zoomFilters([], canvas)).toEqual([]);
  });

  it('drives zoompan from the frame count at the canvas rate', () => {
    expect(zoomFilters([zoom()], canvas)[0]).toBe('fps=30');
    expect(graphOf([zoom()])).toContain(':d=1:s=1920x1080:fps=30');
  });

  it('holds the full scale between the ramps', () => {
    expect(graphOf([zoom()])).toContain('if(lt(on/30,2.900),1,');
  });

  it('ramps linearly when the zoom asks for it', () => {
    const graph = graphOf([zoom({ easing: 'linear' })]);

    expect(graph).toContain(
      "z='1+1.000*if(between(on/30,1.000,3.300),if(lt(on/30,1.400),((on/30-1.000)/0.400)",
    );
    expect(graph).not.toContain('0.5)');
  });

  it('snaps straight to the full scale when there is no ramp in', () => {
    expect(graphOf([zoom({ rampInMs: 0 })])).toContain(
      'if(lt(on/30,1.000),1,if(lt(on/30,2.500),1,',
    );
  });

  it('stays in when there is no ramp out', () => {
    expect(graphOf([zoom({ rampOutMs: 0 })])).toContain(
      'if(lt(on/30,2.900),1,0)',
    );
  });

  it('takes the focus from the zoom, in input pixels', () => {
    expect(graphOf([zoom({ focus: { x: 0.2, y: 0.9 } })])).toContain(
      "x='0.2000*(iw-iw/zoom)':y='0.9000*(ih-ih/zoom)'",
    );
  });
});

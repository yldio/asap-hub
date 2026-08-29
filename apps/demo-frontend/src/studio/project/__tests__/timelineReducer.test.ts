import {
  createEmptyTimeline,
  parseTimeline,
  Timeline,
} from '@asap-hub/demo-timeline';
import { timelineReducer } from '../timelineReducer';

const withClips = (): Timeline => {
  const empty = createEmptyTimeline();
  return timelineReducer(
    timelineReducer(empty, {
      type: 'addClip',
      assetId: 'asset-1',
      durationMs: 5000,
      clipId: 'clip-1',
    }),
    {
      type: 'addClip',
      assetId: 'asset-2',
      durationMs: 4000,
      clipId: 'clip-2',
    },
  );
};

describe('addClip', () => {
  it('appends a source clip spanning the whole asset', () => {
    const timeline = timelineReducer(createEmptyTimeline(), {
      type: 'addClip',
      assetId: 'asset-1',
      durationMs: 5000,
      clipId: 'clip-1',
    });

    expect(timeline.clips).toEqual([
      {
        kind: 'source',
        id: 'clip-1',
        assetId: 'asset-1',
        inMs: 0,
        outMs: 5000,
        volume: 1,
      },
    ]);
  });

  it('never makes a clip too short for the render, whatever the ingest reports', () => {
    const timeline = timelineReducer(createEmptyTimeline(), {
      type: 'addClip',
      assetId: 'asset-1',
      durationMs: 0,
      clipId: 'clip-1',
    });

    expect(timeline.clips[0]).toMatchObject({ inMs: 0, outMs: 100 });
    expect(() => parseTimeline(timeline)).not.toThrow();
  });

  it('inserts at a given index', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'addClip',
      assetId: 'asset-3',
      durationMs: 1000,
      clipId: 'clip-3',
      index: 1,
    });

    expect(timeline.clips.map((clip) => clip.id)).toEqual([
      'clip-1',
      'clip-3',
      'clip-2',
    ]);
  });

  // the take's start is the video's t=0, and it has to outlive the recorder:
  // the capture is often applied in a later session, from the saved document
  it('writes the take start on the clip so a later capture can line up', () => {
    const timeline = timelineReducer(createEmptyTimeline(), {
      type: 'addClip',
      assetId: 'asset-1',
      durationMs: 5000,
      clipId: 'clip-1',
      recordedAtEpochMs: 1_700_000_000_000,
    });

    expect(timeline.cursor).toEqual([
      {
        clipId: 'clip-1',
        offsetMs: 0,
        path: [],
        effects: [],
        recordedAtEpochMs: 1_700_000_000_000,
      },
    ]);
    expect(() => parseTimeline(timeline)).not.toThrow();
  });

  it('leaves an imported clip with no take start at all', () => {
    expect(
      timelineReducer(createEmptyTimeline(), {
        type: 'addClip',
        assetId: 'asset-1',
        durationMs: 5000,
        clipId: 'clip-1',
      }).cursor,
    ).toEqual([]);
  });
});

describe('removeClip', () => {
  it('drops the clip', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'removeClip',
      clipId: 'clip-1',
    });

    expect(timeline.clips.map((clip) => clip.id)).toEqual(['clip-2']);
  });

  it('takes the clip-anchored tracks with it', () => {
    const base = withClips();
    const withEffects: Timeline = {
      ...base,
      zooms: [
        {
          id: 'zoom-1',
          clipId: 'clip-1',
          startMs: 0,
          rampInMs: 300,
          holdMs: 500,
          rampOutMs: 300,
          focus: { x: 0.5, y: 0.5 },
          scale: 2,
          easing: 'easeInOut',
        },
      ],
      chapters: [
        { id: 'chapter-1', clipId: 'clip-1', offsetMs: 0, title: 'Intro' },
        { id: 'chapter-2', clipId: 'clip-2', offsetMs: 0, title: 'Next' },
      ],
      cursor: [{ clipId: 'clip-1', offsetMs: 0, path: [], effects: [] }],
    };

    const timeline = timelineReducer(withEffects, {
      type: 'removeClip',
      clipId: 'clip-1',
    });

    expect(timeline.zooms).toEqual([]);
    expect(timeline.cursor).toEqual([]);
    expect(timeline.chapters.map((chapter) => chapter.id)).toEqual([
      'chapter-2',
    ]);
  });
});

describe('moveClip', () => {
  it('reorders the clips', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'moveClip',
      clipId: 'clip-2',
      toIndex: 0,
    });

    expect(timeline.clips.map((clip) => clip.id)).toEqual(['clip-2', 'clip-1']);
  });
});

describe('trimClip', () => {
  it('trims within the asset', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'trimClip',
      clipId: 'clip-1',
      inMs: 1000,
      outMs: 4000,
      assetDurationMs: 5000,
    });

    expect(timeline.clips[0]).toMatchObject({ inMs: 1000, outMs: 4000 });
  });

  it('refuses to trim past the asset', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'trimClip',
      clipId: 'clip-1',
      outMs: 9000,
      assetDurationMs: 5000,
    });

    expect(timeline.clips[0]).toMatchObject({ outMs: 5000 });
  });
});

describe('splitAt', () => {
  it('splits the clip under the playhead', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'splitAt',
      tMs: 2000,
      clipId: 'clip-new',
    });

    expect(timeline.clips.map((clip) => clip.id)).toEqual([
      'clip-1',
      'clip-new',
      'clip-2',
    ]);
    expect(timeline.clips[0]).toMatchObject({ inMs: 0, outMs: 2000 });
    expect(timeline.clips[1]).toMatchObject({ inMs: 2000, outMs: 5000 });
  });
});

describe('setClipVolume', () => {
  it('sets the volume of a source clip', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'setClipVolume',
      clipId: 'clip-1',
      volume: 0,
    });

    expect(timeline.clips[0]).toMatchObject({ volume: 0 });
  });
});

describe('setTransition', () => {
  it('sets the incoming transition of a later clip', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'setTransition',
      clipId: 'clip-2',
      transition: { type: 'crossfade', durationMs: 500 },
    });

    expect(timeline.clips[1]).toMatchObject({
      transitionIn: { type: 'crossfade', durationMs: 500 },
    });
  });

  it('never gives the first clip a transition', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'setTransition',
      clipId: 'clip-1',
      transition: { type: 'crossfade', durationMs: 500 },
    });

    expect(timeline.clips[0]).not.toHaveProperty('transitionIn');
  });
});

describe('title cards', () => {
  it('inserts a title card at the given index', () => {
    const timeline = timelineReducer(withClips(), {
      type: 'addTitleCard',
      clipId: 'title-1',
      index: 1,
      text: 'Attendance',
      durationMs: 3000,
    });

    expect(timeline.clips.map((clip) => clip.id)).toEqual([
      'clip-1',
      'title-1',
      'clip-2',
    ]);
    expect(timeline.clips[1]).toMatchObject({
      kind: 'title',
      preset: 'centered',
      text: 'Attendance',
      durationMs: 3000,
    });
  });

  it('never lets a card be shortened out of existence', () => {
    const withTitle = timelineReducer(withClips(), {
      type: 'addTitleCard',
      clipId: 'title-1',
      index: 0,
      text: 'Attendance',
      durationMs: 3000,
    });

    const timeline = timelineReducer(withTitle, {
      type: 'updateTitleCard',
      clipId: 'title-1',
      durationMs: 0,
    });

    expect(timeline.clips[0]).toMatchObject({ durationMs: 100 });
    expect(() => parseTimeline(timeline)).not.toThrow();
  });

  it('edits its text and length', () => {
    const withTitle = timelineReducer(withClips(), {
      type: 'addTitleCard',
      clipId: 'title-1',
      index: 0,
      text: 'Attendance',
      durationMs: 3000,
    });

    const timeline = timelineReducer(withTitle, {
      type: 'updateTitleCard',
      clipId: 'title-1',
      subtitle: 'Under a feature flag',
      durationMs: 5000,
    });

    expect(timeline.clips[0]).toMatchObject({
      text: 'Attendance',
      subtitle: 'Under a feature flag',
      durationMs: 5000,
    });
  });
});

describe('banners', () => {
  const banner = {
    id: 'banner-1',
    startMs: 1000,
    durationMs: 4000,
    preset: 'lowerThird' as const,
    text: 'Attendance',
    position: 'bottom' as const,
    animation: 'fade' as const,
  };

  it('adds one to the overlay track', () => {
    expect(
      timelineReducer(withClips(), { type: 'addBanner', banner }).banners,
    ).toEqual([banner]);
  });

  it('updates one without letting its id change', () => {
    const added = timelineReducer(withClips(), { type: 'addBanner', banner });

    const timeline = timelineReducer(added, {
      type: 'updateBanner',
      bannerId: 'banner-1',
      change: { text: 'Speakers', startMs: 2000, id: 'hacked' },
    });

    expect(timeline.banners[0]).toMatchObject({
      id: 'banner-1',
      text: 'Speakers',
      startMs: 2000,
    });
  });

  it('removes one', () => {
    const added = timelineReducer(withClips(), { type: 'addBanner', banner });

    expect(
      timelineReducer(added, { type: 'removeBanner', bannerId: 'banner-1' })
        .banners,
    ).toEqual([]);
  });

  it('leaves banners alone when a clip is removed, because they are program timed', () => {
    const added = timelineReducer(withClips(), { type: 'addBanner', banner });

    expect(
      timelineReducer(added, { type: 'removeClip', clipId: 'clip-1' }).banners,
    ).toEqual([banner]);
  });
});

describe('voice over', () => {
  const take = {
    id: 'take-1',
    assetId: 'audio-1',
    startMs: 1000,
    inMs: 0,
    outMs: 4000,
    volume: 1,
  };

  const withTake = () =>
    timelineReducer(withClips(), { type: 'addNarration', narration: take });

  it('adds a take to the voice over lane', () => {
    expect(withTake().narration).toEqual([take]);
  });

  it('retimes a take without letting it change recording', () => {
    const timeline = timelineReducer(withTake(), {
      type: 'updateNarration',
      narrationId: 'take-1',
      change: { startMs: 2500, assetId: 'somewhere-else' } as never,
    });

    expect(timeline.narration[0]).toMatchObject({
      startMs: 2500,
      assetId: 'audio-1',
    });
  });

  it('refuses a skip that would run past the point the take plays up to', () => {
    const timeline = timelineReducer(withTake(), {
      type: 'updateNarration',
      narrationId: 'take-1',
      change: { inMs: 6000 },
    });

    expect(timeline.narration[0]).toMatchObject({ inMs: 0, outMs: 4000 });
  });

  it('refuses an end that would land before the take starts playing', () => {
    const trimmed = timelineReducer(withTake(), {
      type: 'updateNarration',
      narrationId: 'take-1',
      change: { inMs: 2000 },
    });

    const timeline = timelineReducer(trimmed, {
      type: 'updateNarration',
      narrationId: 'take-1',
      change: { startMs: 3000, inMs: 2000, outMs: 1000 },
    });

    expect(timeline.narration[0]).toMatchObject({
      startMs: 1000,
      inMs: 2000,
      outMs: 4000,
    });
  });

  it('keeps every take the schema will accept', () => {
    const timeline = timelineReducer(withTake(), {
      type: 'updateNarration',
      narrationId: 'take-1',
      change: { inMs: 6000 },
    });

    expect(() => parseTimeline(timeline)).not.toThrow();
  });

  it('removes a take', () => {
    expect(
      timelineReducer(withTake(), {
        type: 'removeNarration',
        narrationId: 'take-1',
      }).narration,
    ).toEqual([]);
  });

  it('keeps a take when a clip goes, because it is program timed', () => {
    expect(
      timelineReducer(withTake(), { type: 'removeClip', clipId: 'clip-1' })
        .narration,
    ).toEqual([take]);
  });
});

describe('title card fades', () => {
  const withTitle = () =>
    timelineReducer(createEmptyTimeline(), {
      type: 'addTitleCard',
      clipId: 'title-1',
      index: 0,
      text: 'Attendance',
      durationMs: 3000,
    });

  it('starts with no fade of its own, so the default applies', () => {
    const clip = withTitle().clips[0];

    expect(clip).toHaveProperty('kind', 'title');
    expect(clip && 'fadeInMs' in clip && clip.fadeInMs).toBeFalsy();
  });

  it('takes the ramps the creator sets', () => {
    const timeline = timelineReducer(withTitle(), {
      type: 'updateTitleCard',
      clipId: 'title-1',
      fadeInMs: 800,
      fadeOutMs: 150,
    });

    expect(timeline.clips[0]).toMatchObject({ fadeInMs: 800, fadeOutMs: 150 });
  });

  // zero is a real choice, not an absent one: the text arrives instantly
  it('keeps an instant fade rather than falling back to the default', () => {
    const timeline = timelineReducer(withTitle(), {
      type: 'updateTitleCard',
      clipId: 'title-1',
      fadeInMs: 0,
    });

    expect(timeline.clips[0]).toMatchObject({ fadeInMs: 0 });
  });

  it('leaves the heading alone when only a fade changes', () => {
    const timeline = timelineReducer(withTitle(), {
      type: 'updateTitleCard',
      clipId: 'title-1',
      fadeOutMs: 900,
    });

    expect(timeline.clips[0]).toMatchObject({
      text: 'Attendance',
      durationMs: 3000,
    });
  });
});

describe('chapters', () => {
  const withMarker = () =>
    timelineReducer(withClips(), {
      type: 'addChapter',
      id: 'chapter-1',
      clipId: 'clip-1',
      offsetMs: 1000,
      title: 'Attendance',
    });

  it('renames without moving', () => {
    const timeline = timelineReducer(withMarker(), {
      type: 'updateChapter',
      chapterId: 'chapter-1',
      title: 'Speakers',
    });

    expect(timeline.chapters[0]).toEqual({
      id: 'chapter-1',
      clipId: 'clip-1',
      offsetMs: 1000,
      title: 'Speakers',
    });
  });

  // a retimed marker re-anchors to whichever clip is under the new moment, so
  // it still travels with that clip when it is trimmed or reordered
  it('re-anchors to another clip when it is retimed across a boundary', () => {
    const timeline = timelineReducer(withMarker(), {
      type: 'updateChapter',
      chapterId: 'chapter-1',
      clipId: 'clip-2',
      offsetMs: 500,
    });

    expect(timeline.chapters[0]).toMatchObject({
      clipId: 'clip-2',
      offsetMs: 500,
      title: 'Attendance',
    });
  });

  it('accepts the very start of a clip', () => {
    const timeline = timelineReducer(withMarker(), {
      type: 'updateChapter',
      chapterId: 'chapter-1',
      offsetMs: 0,
    });

    expect(timeline.chapters[0]).toMatchObject({ offsetMs: 0 });
  });

  it('goes when its clip goes', () => {
    expect(
      timelineReducer(withMarker(), { type: 'removeClip', clipId: 'clip-1' })
        .chapters,
    ).toEqual([]);
  });
});

describe('a playhead that is not on a whole millisecond', () => {
  // playback accumulates fractional DOMHighResTimeStamp deltas, and every
  // millisecond in the document has to be an integer or the server rejects the
  // whole timeline and no further save can succeed
  it('splits on whole milliseconds', () => {
    const next = timelineReducer(withClips(), {
      type: 'splitAt',
      tMs: 2123.400000000001,
      clipId: 'clip-3',
    });

    const times = next.clips.flatMap((clip) =>
      clip.kind === 'source' ? [clip.inMs, clip.outMs] : [clip.durationMs ?? 0],
    );

    expect(times.filter((ms) => !Number.isInteger(ms))).toEqual([]);
  });

  it('keeps the document valid for the server', () => {
    const next = timelineReducer(withClips(), {
      type: 'splitAt',
      tMs: 2123.400000000001,
      clipId: 'clip-3',
    });

    expect(() => parseTimeline(JSON.parse(JSON.stringify(next)))).not.toThrow();
  });
});


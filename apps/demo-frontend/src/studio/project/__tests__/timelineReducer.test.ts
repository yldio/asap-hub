import { createEmptyTimeline, Timeline } from '@asap-hub/demo-timeline';
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

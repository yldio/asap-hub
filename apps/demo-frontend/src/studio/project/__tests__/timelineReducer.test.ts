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

describe('replaceTimeline', () => {
  it('swaps the whole document', () => {
    const replacement = createEmptyTimeline();

    expect(
      timelineReducer(withClips(), {
        type: 'replaceTimeline',
        timeline: replacement,
      }),
    ).toBe(replacement);
  });
});

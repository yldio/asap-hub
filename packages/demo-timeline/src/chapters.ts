import { layoutClips } from './clips';
import { Timeline } from './schema';

export type ResolvedChapter = {
  // the marker's own id, or the title card's clip id: the editor needs a stable
  // identity so renaming a chapter does not remount its field on every keystroke
  id: string;
  kind: 'marker' | 'title';
  startMs: number;
  title: string;
};

const byStart = (a: ResolvedChapter, b: ResolvedChapter): number =>
  a.startMs - b.startMs;

// The watch page reads chapters off the video item, so the clip-anchored markers
// and the title cards have to be resolved into program time. A title card is a
// section heading by definition, so it becomes a chapter without being asked.
export type ResolveOptions = {
  // The editor shows every marker exactly as stored: a half typed name must not
  // make its row vanish under the cursor, and two markers landing on the same
  // frame have to stay visible or there is no way to delete the spare one. The
  // render collapses both cases, because a player cannot use them.
  forEditing?: boolean;
};

export const resolveChapters = (
  timeline: Timeline,
  { forEditing = false }: ResolveOptions = {},
): ResolvedChapter[] => {
  const placements = layoutClips(timeline.clips);
  // the editor re-resolves on every keystroke, so the markers are looked up
  // against an index rather than scanned against the clip list one by one
  const startByClipId = new Map(
    placements.map((placement) => [placement.clip.id, placement.startMs]),
  );

  const fromTitles = placements.flatMap((placement) =>
    placement.clip.kind === 'title' && placement.clip.text.trim()
      ? [
          {
            id: placement.clip.id,
            kind: 'title' as const,
            startMs: placement.startMs,
            title: placement.clip.text.trim(),
          },
        ]
      : [],
  );

  const fromMarkers = timeline.chapters.flatMap((marker) => {
    const start = startByClipId.get(marker.clipId);
    return start === undefined || (!marker.title.trim() && !forEditing)
      ? []
      : [
          {
            id: marker.id,
            kind: 'marker' as const,
            startMs: start + marker.offsetMs,
            title: marker.title,
          },
        ];
  });

  const resolved = [...fromTitles, ...fromMarkers].sort(byStart);

  // two chapters on the same frame would give the player an empty segment
  return forEditing
    ? resolved
    : resolved.filter(
        (chapter, index) =>
          index === 0 || chapter.startMs !== resolved[index - 1]?.startMs,
      );
};

export type VideoChapter = { startMs: number; title: string };

// what the video row carries for the watch page: the editor's id and kind are
// its own business, and the row's schema does not declare them
export const videoChapters = (timeline: Timeline): VideoChapter[] =>
  resolveChapters(timeline).map(({ startMs, title }) => ({ startMs, title }));

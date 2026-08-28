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
  // the editor keeps an untitled marker on screen so a half typed name does not
  // make the row disappear under the cursor; the render drops it
  includeUntitled?: boolean;
};

export const resolveChapters = (
  timeline: Timeline,
  { includeUntitled = false }: ResolveOptions = {},
): ResolvedChapter[] => {
  const placements = layoutClips(timeline.clips);
  const startOf = (clipId: string): number | undefined =>
    placements.find((placement) => placement.clip.id === clipId)?.startMs;

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
    const start = startOf(marker.clipId);
    return start === undefined || (!marker.title.trim() && !includeUntitled)
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
  return resolved.filter(
    (chapter, index) =>
      index === 0 || chapter.startMs !== resolved[index - 1]?.startMs,
  );
};

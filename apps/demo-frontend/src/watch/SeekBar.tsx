/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, PointerEvent, useRef, useState } from 'react';

import type { Chapter } from '../api/types';
import { fern, rem } from '../ui/theme';
import { toSegments } from './ChapterProgress';
import { ratioAt } from './playback';

const barStyles = css({
  position: 'relative',
  display: 'flex',
  gap: rem(2),
  alignItems: 'center',
  height: rem(16),
  cursor: 'pointer',
  touchAction: 'none',
});

const segmentStyles = css({
  position: 'relative',
  height: rem(3),
  borderRadius: rem(2),
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
  transition: 'height 100ms',
});

const activeSegmentStyles = css({ height: rem(5) });

const fillStyles = css({
  position: 'absolute',
  inset: 0,
  transformOrigin: 'left',
  backgroundColor: fern.rgb,
});

const bufferedStyles = css({
  position: 'absolute',
  inset: 0,
  transformOrigin: 'left',
  backgroundColor: 'rgba(255, 255, 255, 0.45)',
});

const knobStyles = css({
  position: 'absolute',
  top: '50%',
  width: rem(13),
  height: rem(13),
  marginLeft: rem(-6.5),
  marginTop: rem(-6.5),
  borderRadius: '50%',
  backgroundColor: fern.rgb,
  pointerEvents: 'none',
});

const progressOf = (seconds: number, start: number, end: number): number => {
  const span = end - start;
  if (span <= 0) return seconds >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (seconds - start) / span));
};

const SeekBar: FC<{
  readonly chapters: Chapter[];
  readonly durationSeconds: number;
  readonly currentSeconds: number;
  readonly bufferedSeconds: number;
  readonly onSeek: (seconds: number) => void;
  readonly onScrubbingChange: (scrubbing: boolean) => void;
  readonly onHover: (
    position: { seconds: number; left: number } | null,
  ) => void;
}> = ({
  chapters,
  durationSeconds,
  currentSeconds,
  bufferedSeconds,
  onSeek,
  onScrubbingChange,
  onHover,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const segments = toSegments(chapters, durationSeconds);

  const positionAt = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || durationSeconds <= 0) return null;
    const bounds = bar.getBoundingClientRect();
    const ratio = ratioAt(clientX, bounds);
    return { seconds: ratio * durationSeconds, left: ratio * bounds.width };
  };

  const segmentIndexAt = (seconds: number) => {
    const index = segments.findIndex(
      (segment) => seconds >= segment.start && seconds < segment.end,
    );
    return index === -1 ? segments.length - 1 : index;
  };

  const track = (event: PointerEvent<HTMLDivElement>) => {
    const position = positionAt(event.clientX);
    if (!position) return undefined;
    setHovered(segmentIndexAt(position.seconds));
    onHover(position);
    return position;
  };

  return (
    <div
      ref={barRef}
      css={barStyles}
      role="slider"
      tabIndex={-1}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(durationSeconds)}
      aria-valuenow={Math.round(currentSeconds)}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setScrubbing(true);
        onScrubbingChange(true);
        const position = track(event);
        if (position) onSeek(position.seconds);
      }}
      onPointerMove={(event) => {
        const position = track(event);
        if (position && scrubbing) onSeek(position.seconds);
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        setScrubbing(false);
        onScrubbingChange(false);
      }}
      onPointerLeave={() => {
        if (scrubbing) return;
        setHovered(null);
        onHover(null);
      }}
    >
      {segments.map((segment, index) => {
        const span = segment.end - segment.start;
        return (
          <div
            key={segment.start}
            css={[segmentStyles, hovered === index && activeSegmentStyles]}
            style={{ flexGrow: span <= 0 ? 0.001 : span }}
          >
            <div
              css={bufferedStyles}
              style={{
                transform: `scaleX(${progressOf(
                  bufferedSeconds,
                  segment.start,
                  segment.end,
                )})`,
              }}
            />
            <div
              css={fillStyles}
              style={{
                transform: `scaleX(${progressOf(
                  currentSeconds,
                  segment.start,
                  segment.end,
                )})`,
              }}
            />
          </div>
        );
      })}
      {durationSeconds > 0 && (
        <div
          css={knobStyles}
          style={{
            left: `${
              Math.min(1, Math.max(0, currentSeconds / durationSeconds)) * 100
            }%`,
          }}
        />
      )}
    </div>
  );
};

export default SeekBar;

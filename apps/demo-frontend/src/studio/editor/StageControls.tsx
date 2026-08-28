/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, PointerEvent as ReactPointerEvent, memo, useRef } from 'react';
import EditorButton from './EditorButton';
import { editorTheme } from './editorTheme';
import { formatTimecode } from './geometry';
import {
  CollapseIcon,
  ExpandIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  SkipEndIcon,
  SkipStartIcon,
  SoundIcon,
} from './icons';

const barStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  maxWidth: '100%',
  padding: '6px 4px',
  boxSizing: 'border-box',
  color: editorTheme.text,
});

const seekStyles = css({
  position: 'relative',
  flex: 1,
  minWidth: 60,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  touchAction: 'none',
  border: 0,
  background: 'transparent',
  padding: 0,
});

const trackStyles = css({
  position: 'relative',
  width: '100%',
  height: 5,
  borderRadius: 3,
  backgroundColor: editorTheme.line,
  overflow: 'hidden',
});

const fillStyles = css({
  position: 'absolute',
  inset: 0,
  transformOrigin: 'left center',
  backgroundColor: editorTheme.playhead,
});

const knobStyles = css({
  position: 'absolute',
  top: '50%',
  width: 11,
  height: 11,
  marginLeft: -5,
  marginTop: -5,
  borderRadius: '50%',
  backgroundColor: editorTheme.playhead,
  pointerEvents: 'none',
});

const timeStyles = css({
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  color: editorTheme.muted,
  whiteSpace: 'nowrap',
});

const volumeStyles = css({ width: 80, accentColor: editorTheme.playhead });

type Props = {
  readonly playing: boolean;
  readonly canPlay: boolean;
  readonly playheadMs: number;
  readonly durationMs: number;
  readonly volume: number;
  readonly fullscreen?: { active: boolean; toggle: () => void };
  readonly onToggle: () => void;
  readonly onSeek: (ms: number) => void;
  readonly onSkipStart: () => void;
  readonly onSkipEnd: () => void;
  readonly onVolume: (volume: number) => void;
};

// the transport that belongs to the picture: scrubbing, sound and fullscreen
// sit under the stage where a viewer expects them, not in the editor chrome
const StageControls: FC<Props> = ({
  playing,
  canPlay,
  playheadMs,
  durationMs,
  volume,
  fullscreen,
  onToggle,
  onSeek,
  onSkipStart,
  onSkipEnd,
  onVolume,
}) => {
  const seekRef = useRef<HTMLDivElement>(null);
  const progress = durationMs > 0 ? playheadMs / durationMs : 0;

  const seekTo = (clientX: number) => {
    const bounds = seekRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width <= 0) return;
    const ratio = Math.min(
      1,
      Math.max(0, (clientX - bounds.left) / bounds.width),
    );
    onSeek(ratio * durationMs);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      seekTo(event.clientX);
    }
  };

  return (
    <div css={barStyles}>
      <EditorButton
        aria-label="Jump to the start"
        icon={<SkipStartIcon size={15} />}
        onClick={onSkipStart}
      />
      <EditorButton
        aria-label={playing ? 'Pause' : 'Play'}
        icon={playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        primary
        disabled={!canPlay}
        onClick={onToggle}
      />
      <EditorButton
        aria-label="Jump to the end"
        icon={<SkipEndIcon size={15} />}
        onClick={onSkipEnd}
      />

      <div
        ref={seekRef}
        css={seekStyles}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs)}
        aria-valuenow={Math.round(playheadMs)}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          seekTo(event.clientX);
        }}
        onPointerMove={onPointerMove}
        onKeyDown={(event) => {
          // without this the page scrolls sideways as well as the playhead
          // moving, because the arrow keeps its default on a plain div
          const seeks: Record<string, number> = {
            ArrowLeft: playheadMs - 1000,
            ArrowRight: playheadMs + 1000,
            Home: 0,
            End: durationMs,
          };
          const target = seeks[event.key];
          if (target === undefined) return;
          event.preventDefault();
          onSeek(Math.min(durationMs, Math.max(0, target)));
        }}
      >
        <span css={trackStyles}>
          <span css={fillStyles} style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span css={knobStyles} style={{ left: `${progress * 100}%` }} />
      </div>

      <span css={timeStyles}>
        {formatTimecode(playheadMs)} / {formatTimecode(durationMs)}
      </span>

      <EditorButton
        aria-label={volume === 0 ? 'Unmute the preview' : 'Mute the preview'}
        icon={volume === 0 ? <MuteIcon size={15} /> : <SoundIcon size={15} />}
        onClick={() => onVolume(volume === 0 ? 1 : 0)}
      />
      <input
        css={volumeStyles}
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        aria-label="Preview volume"
        onChange={(event) => onVolume(Number(event.target.value))}
      />

      {fullscreen ? (
        <EditorButton
          aria-label={fullscreen.active ? 'Leave fullscreen' : 'Fullscreen'}
          icon={
            fullscreen.active ? (
              <CollapseIcon size={15} />
            ) : (
              <ExpandIcon size={15} />
            )
          }
          onClick={fullscreen.toggle}
        />
      ) : null}
    </div>
  );
};

// the playhead re-renders the editor on every frame; these panels only ever
// change when the document or the selection does
export default memo(StageControls);

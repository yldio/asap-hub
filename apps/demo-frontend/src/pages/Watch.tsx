/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { useVideo, useVideoAccess } from '../api/hooks';
import type { Chapter, Video, VideoAccess } from '../api/types';
import ChapterList from '../watch/ChapterList';
import ChapterProgress from '../watch/ChapterProgress';
import SpritePreview from '../watch/SpritePreview';
import useThumbnails from '../watch/useThumbnails';
import { Button, Card, Headline, Spinner } from '../ui/components';
import { charcoal, lead, rem, steel } from '../ui/theme';
import { formatDuration, formatRecordedAt } from '../utils/time';

const layoutStyles = css({
  display: 'grid',
  gridTemplateColumns: `1fr minmax(${rem(260)}, ${rem(320)})`,
  gap: rem(24),
  alignItems: 'start',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
  },
});

const playerFrameStyles = css({
  backgroundColor: charcoal.rgb,
  borderRadius: rem(8),
  overflow: 'hidden',
  border: `1px solid ${steel.rgb}`,
});

const videoStyles = css({
  display: 'block',
  width: '100%',
  aspectRatio: '16 / 9',
  backgroundColor: charcoal.rgb,
});

const metaStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(12),
  fontSize: rem(14),
  color: lead.rgb,
  paddingTop: rem(12),
});

const statePanelStyles = css({
  padding: rem(40),
  display: 'grid',
  gap: rem(12),
  justifyItems: 'start',
});

const previewWrapperStyles = css({ position: 'relative' });

type Preview = { seconds: number; left: number } | null;

const WatchPlayer: FC<{
  readonly video: Video;
  readonly access: VideoAccess;
}> = ({ video, access }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [preview, setPreview] = useState<Preview>(null);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);
  const thumbnails = useThumbnails(access.thumbnailsVttUrl);

  const initialSeconds = Number(searchParams.get('t'));
  const durationSeconds = video.durationMs / 1000;

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !Number.isFinite(initialSeconds) || initialSeconds <= 0) {
      return;
    }
    element.currentTime = initialSeconds;
    setCurrentTime(initialSeconds);
  }, [initialSeconds]);

  const seekTo = useCallback((seconds: number) => {
    const element = videoRef.current;
    if (!element) return;
    element.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const onSelectChapter = useCallback(
    (chapter: Chapter) => seekTo(chapter.startMs / 1000),
    [seekTo],
  );

  return (
    <div css={layoutStyles}>
      <div>
        <div css={playerFrameStyles}>
          {' '}
          <video
            ref={videoRef}
            css={videoStyles}
            controls
            preload="metadata"
            src={access.streamUrl}
            data-testid="demo-video"
            onTimeUpdate={(event) =>
              setCurrentTime(event.currentTarget.currentTime)
            }
          />
        </div>
        <div css={previewWrapperStyles}>
          <ChapterProgress
            chapters={video.chapters}
            durationSeconds={durationSeconds}
            currentSeconds={currentTime}
            onSeek={seekTo}
            onPreview={setPreview}
          />
          {preview && (
            <SpritePreview
              spriteUrl={access.spriteUrl}
              cues={thumbnails}
              seconds={preview.seconds}
              left={preview.left}
            />
          )}
        </div>
        <div css={metaStyles}>
          <span>{formatRecordedAt(video.recordedAt)}</span>
          <span>{formatDuration(video.durationMs)}</span>
          <span>Recorded by {video.createdBy.name}</span>
        </div>
      </div>

      <div css={previewWrapperStyles}>
        {hoveredChapter !== null && (
          <SpritePreview
            spriteUrl={access.spriteUrl}
            cues={thumbnails}
            seconds={hoveredChapter / 1000}
            left={0}
            anchor="top-left"
          />
        )}
        <ChapterList
          chapters={video.chapters}
          currentSeconds={currentTime}
          onSelect={onSelectChapter}
          onHover={(chapter) => setHoveredChapter(chapter?.startMs ?? null)}
        />
      </div>
    </div>
  );
};

const Watch: FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const video = useVideo(id);
  const access = useVideoAccess(id);

  if (video.isLoading) return <Spinner label="Loading demo" />;

  if (video.isError || !video.data) {
    return (
      <Card overrideStyles={statePanelStyles}>
        <Headline level={3}>We could not load this demo</Headline>
        <p css={{ color: lead.rgb, margin: 0 }}>
          It may have been removed, or you may not have access to it.
        </p>
        <Button
          onClick={() => {
            void video.refetch();
          }}
        >
          Retry
        </Button>
      </Card>
    );
  }

  if (video.data.processingState !== 'ready') {
    const failed = video.data.processingState === 'failed';
    return (
      <>
        <Headline level={2}>{video.data.title}</Headline>
        <div css={{ height: rem(16) }} />
        <Card overrideStyles={statePanelStyles}>
          <Headline level={3}>
            {failed
              ? 'This demo failed to process'
              : 'This demo is still processing'}
          </Headline>
          <p css={{ color: lead.rgb, margin: 0 }}>
            {failed
              ? 'The recording could not be encoded. Ask a creator to upload it again.'
              : 'Encoding usually takes a few minutes. Check back shortly.'}
          </p>
          {!failed && (
            <Button
              onClick={() => {
                void video.refetch();
              }}
            >
              Check again
            </Button>
          )}
        </Card>
      </>
    );
  }

  if (access.isLoading) return <Spinner label="Preparing playback" />;

  if (access.isError || !access.data) {
    return (
      <>
        <Headline level={2}>{video.data.title}</Headline>
        <div css={{ height: rem(16) }} />
        <Card overrideStyles={statePanelStyles}>
          <Headline level={3}>Playback is not available</Headline>
          <p css={{ color: lead.rgb, margin: 0 }}>
            We could not get permission to stream this demo. Your access may
            have expired, or you may not be allowed to watch it.
          </p>
          <Button
            onClick={() => {
              void access.refetch();
            }}
          >
            Retry
          </Button>
        </Card>
      </>
    );
  }

  return (
    <>
      <Headline level={2}>{video.data.title}</Headline>
      <div css={{ height: rem(16) }} />
      <WatchPlayer video={video.data} access={access.data} />
    </>
  );
};

export default Watch;

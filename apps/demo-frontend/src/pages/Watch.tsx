/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

import { useVideo, useVideoAccess } from '../api/hooks';
import type { Chapter, Video, VideoAccess } from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import { editPathOf } from '../library/VideoCard';
import ChapterList from '../watch/ChapterList';
import Player from '../watch/Player';
import SpritePreview from '../watch/SpritePreview';
import useThumbnails from '../watch/useThumbnails';
import { Button, ButtonLink, Card, Headline, Spinner } from '../ui/components';
import { lead, rem } from '../ui/theme';
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

const metaStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
  fontSize: rem(14),
  color: lead.rgb,
  paddingTop: rem(12),
});

const downloadFileName = (title: string) =>
  `${title.replace(/[\\/:*?"<>|]/g, '-').trim() || 'demo'}.mp4`;

const statePanelStyles = css({
  padding: rem(40),
  display: 'grid',
  gap: rem(12),
  justifyItems: 'start',
});

const previewWrapperStyles = css({ position: 'relative' });

const WatchPlayer: FC<{
  readonly video: Video;
  readonly access: VideoAccess;
  readonly onRequestAccess: () => void;
}> = ({ video, access, onRequestAccess }) => {
  const isCreator = useIsCreator();
  const [searchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);
  const thumbnails = useThumbnails(access.thumbnailsVttUrl);
  const seekRef = useRef<(seconds: number) => void>();

  const parsedStart = Number(searchParams.get('t'));
  const initialSeconds =
    Number.isFinite(parsedStart) && parsedStart > 0 ? parsedStart : undefined;

  const registerSeek = useCallback((seek: (seconds: number) => void) => {
    seekRef.current = seek;
  }, []);

  const onSelectChapter = useCallback(
    (chapter: Chapter) => seekRef.current?.(chapter.startMs / 1000),
    [],
  );

  return (
    <div css={layoutStyles}>
      <div>
        <Player
          access={access}
          chapters={video.chapters}
          durationMs={video.durationMs}
          initialSeconds={initialSeconds}
          currentSeconds={currentTime}
          onTimeChange={setCurrentTime}
          registerSeek={registerSeek}
          onRequestAccess={onRequestAccess}
        />
        <div css={metaStyles}>
          <span>{formatRecordedAt(video.recordedAt)}</span>
          <span>{formatDuration(video.durationMs)}</span>
          <span>Recorded by {video.createdBy.name}</span>
          <ButtonLink
            small
            href={access.streamUrl}
            download={downloadFileName(video.title)}
            css={{ marginLeft: 'auto' }}
          >
            Download
          </ButtonLink>
          {isCreator && (
            <Link to={editPathOf(video)} css={{ fontWeight: 'bold' }}>
              Edit demo
            </Link>
          )}
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
    // a studio project that has never been exported has nothing to play, and
    // no amount of waiting will change that
    const unexported = video.data.processingState === 'empty';
    const settled = failed || unexported;
    return (
      <>
        <Headline level={2}>{video.data.title}</Headline>
        <div css={{ height: rem(16) }} />
        <Card overrideStyles={statePanelStyles}>
          <Headline level={3}>
            {failed ? 'This demo failed to process' : null}
            {unexported ? 'This demo has not been exported yet' : null}
            {settled ? null : 'This demo is still processing'}
          </Headline>
          <p css={{ color: lead.rgb, margin: 0 }}>
            {failed
              ? 'The recording could not be encoded. Ask a creator to upload it again.'
              : null}
            {unexported
              ? 'It is still a draft in the studio. A creator has to export it before it can be watched.'
              : null}
            {settled
              ? null
              : 'Encoding usually takes a few minutes. Check back shortly.'}
          </p>
          {!settled && (
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
      <WatchPlayer
        video={video.data}
        access={access.data}
        onRequestAccess={() => {
          void access.refetch();
        }}
      />
    </>
  );
};

export default Watch;

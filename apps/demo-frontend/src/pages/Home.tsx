/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { Link, useSearchParams } from 'react-router';

import { useFolders, useVideos } from '../api/hooks';
import type { Video } from '../api/types';
import { useIsCreator } from '../auth/MeContext';
import { Badge, Card, Headline, Spinner } from '../ui/components';
import {
  charcoal,
  lead,
  mint,
  pine,
  rem,
  silver,
  steel,
  tin,
} from '../ui/theme';
import { formatDuration, formatRecordedAt } from '../utils/time';

const gridStyles = css({
  display: 'grid',
  gridTemplateColumns: `minmax(${rem(200)}, ${rem(240)}) 1fr`,
  gap: rem(32),
  alignItems: 'start',
  '@media (max-width: 800px)': {
    gridTemplateColumns: '1fr',
  },
});

const sidebarHeadingStyles = css({
  fontSize: rem(12),
  letterSpacing: rem(1.2),
  textTransform: 'uppercase',
  color: lead.rgb,
  fontWeight: 'bold',
  paddingBottom: rem(12),
});

const folderListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: rem(2),
});

const folderLinkStyles = css({
  display: 'block',
  padding: `${rem(8)} ${rem(12)}`,
  borderRadius: rem(4),
  color: charcoal.rgb,
  textDecoration: 'none',
  fontSize: rem(15),
  ':hover': { backgroundColor: silver.rgb },
});

const folderLinkActiveStyles = css({
  backgroundColor: mint.rgb,
  color: pine.rgb,
  fontWeight: 'bold',
  ':hover': { backgroundColor: mint.rgb },
});

const videoListStyles = css({
  display: 'grid',
  gap: rem(16),
});

const videoCardStyles = css({
  padding: rem(24),
  display: 'grid',
  gap: rem(8),
});

const titleLinkStyles = css({
  color: charcoal.rgb,
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});

const metaStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
  fontSize: rem(14),
  color: lead.rgb,
});

const dotStyles = css({ color: tin.rgb });

const emptyStyles = css({
  padding: rem(32),
  border: `1px dashed ${steel.rgb}`,
  borderRadius: rem(8),
  color: lead.rgb,
  textAlign: 'center' as const,
});

const isWatchable = (video: Video): boolean =>
  video.processingState === 'ready' && video.status === 'published';

const VideoStatusBadge: FC<{ readonly video: Video }> = ({ video }) => {
  if (video.processingState === 'failed') {
    return <Badge tone="error">Failed</Badge>;
  }
  if (video.processingState !== 'ready') {
    return <Badge tone="warning">Processing</Badge>;
  }
  if (video.status === 'draft') {
    return <Badge tone="neutral">Draft</Badge>;
  }
  return null;
};

const VideoCard: FC<{ readonly video: Video; readonly isCreator: boolean }> = ({
  video,
  isCreator,
}) => (
  <Card overrideStyles={videoCardStyles}>
    <div css={{ display: 'flex', gap: rem(12), alignItems: 'baseline' }}>
      <h3 css={{ fontSize: rem(18), fontWeight: 'bold', margin: 0 }}>
        <Link to={`/videos/${video.id}`} css={titleLinkStyles}>
          {video.title}
        </Link>
      </h3>
      {isCreator && <VideoStatusBadge video={video} />}
    </div>
    <div css={metaStyles}>
      <span>{formatRecordedAt(video.recordedAt)}</span>
      <span css={dotStyles}>&middot;</span>
      <span>{formatDuration(video.durationMs)}</span>
      <span css={dotStyles}>&middot;</span>
      <span>
        {video.chapters.length}{' '}
        {video.chapters.length === 1 ? 'chapter' : 'chapters'}
      </span>
    </div>
  </Card>
);

const Home: FC = () => {
  const [searchParams] = useSearchParams();
  const selectedFolder = searchParams.get('folder') ?? undefined;
  const isCreator = useIsCreator();
  const folders = useFolders();
  const videos = useVideos(selectedFolder);

  const visibleVideos = (videos.data ?? []).filter(
    (video) => isCreator || isWatchable(video),
  );

  return (
    <div css={gridStyles}>
      <aside>
        <h2 css={sidebarHeadingStyles}>Folders</h2>
        {folders.isLoading ? (
          <Spinner label="Loading folders" />
        ) : (
          <ul css={folderListStyles}>
            <li>
              <Link
                to="/"
                css={[
                  folderLinkStyles,
                  !selectedFolder && folderLinkActiveStyles,
                ]}
              >
                All demos
              </Link>
            </li>
            {(folders.data ?? []).map((folder) => (
              <li key={folder.id}>
                <Link
                  to={`/?folder=${folder.id}`}
                  css={[
                    folderLinkStyles,
                    selectedFolder === folder.id && folderLinkActiveStyles,
                  ]}
                >
                  {folder.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section>
        <Headline level={3}>
          {folders.data?.find(({ id }) => id === selectedFolder)?.name ??
            'All demos'}
        </Headline>
        <div css={{ height: rem(16) }} />
        {videos.isLoading && <Spinner label="Loading demos" />}
        {videos.isError && (
          <div css={emptyStyles}>
            We could not load the demos in this folder.
          </div>
        )}
        {!videos.isLoading && !videos.isError && visibleVideos.length === 0 && (
          <div css={emptyStyles}>No demos here yet.</div>
        )}
        <div css={videoListStyles}>
          {visibleVideos.map((video) => (
            <VideoCard key={video.id} video={video} isCreator={isCreator} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import {
  TeamProductivityPerformance,
  TeamProductivityResponse,
} from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { CaptionCard, CaptionItem, PageControls } from '..';

import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { InactiveBadgeIcon } from '../icons';
import { rem, tabletScreen } from '../pixels';
import { getPerformanceIcon } from '../utils';

const container = css({
  display: 'grid',
  paddingTop: rem(32),
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: rem(16),
  },
});

const rowTitleStyles = css({
  paddingTop: rem(32),
  paddingBottom: rem(16),
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  padding: `${rem(20)} ${rem(24)} 0`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderBottom: 'none',
  },
  ':nth-of-type(2n+3)': {
    background: neutral200.rgb,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: rem(15),
    borderRadius: rem(borderRadius),
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

const rowValueStyles = css({
  display: 'flex',
  gap: rem(6),
  fontWeight: 400,
});

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type TeamProductivityTableProps = ComponentProps<typeof PageControls> & {
  data: TeamProductivityResponse[];
  performance: TeamProductivityPerformance;
};

const TeamProductivityTable: React.FC<TeamProductivityTableProps> = ({
  data,
  performance,
  ...pageControlProps
}) => (
  <>
    <CaptionCard>
      <>
        <CaptionItem label="Article" {...performance.article} />
        <CaptionItem label="Lab Resources" {...performance.labResource} />
        <CaptionItem label="Bioinformatics" {...performance.bioinformatics} />
        <CaptionItem label="Protocols" {...performance.protocol} />
        <CaptionItem label="Datasets" {...performance.dataset} />
      </>
    </CaptionCard>
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>Articles</span>
          <span css={titleStyles}>Bioinformatics</span>
          <span css={titleStyles}>Datasets</span>
          <span css={titleStyles}>Lab Resources</span>
          <span css={titleStyles}>Protocols</span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p css={iconStyles}>
              <Link
                href={
                  // TODO: fix this
                  networkRoutes.DEFAULT.path
                  // network({}).teams({}).team({ teamId: row.id }).$
                }
              >
                {row.name}
              </Link>

              {row.isInactive && <InactiveBadgeIcon />}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Articles</span>
            <p css={rowValueStyles}>
              {row.Article}{' '}
              {getPerformanceIcon(row.Article, performance.article)}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Bioinformatics</span>
            <p css={rowValueStyles}>
              {row.Bioinformatics}{' '}
              {getPerformanceIcon(
                row.Bioinformatics,
                performance.bioinformatics,
              )}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Datasets</span>
            <p css={rowValueStyles}>
              {row.Dataset}{' '}
              {getPerformanceIcon(row.Dataset, performance.dataset)}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Lab Resources</span>
            <p css={rowValueStyles}>
              {row['Lab Resource']}{' '}
              {getPerformanceIcon(row['Lab Resource'], performance.labResource)}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Protocols</span>
            <p css={rowValueStyles}>
              {row.Protocol}{' '}
              {getPerformanceIcon(row.Protocol, performance.protocol)}
            </p>
          </div>
        ))}
      </div>
    </Card>
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </>
);

export default TeamProductivityTable;

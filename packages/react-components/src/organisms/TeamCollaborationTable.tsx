import { PerformanceMetricByDocumentType } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls, PerformanceCard, TeamCollaborationRow } from '..';

import { Card } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, steel } from '../colors';
import { rem, tabletScreen } from '../pixels';

const container = css({
  display: 'grid',
  paddingTop: rem(12),
});

const columnsStyles = (isWithinTeam: boolean) =>
  css({
    [`@media (min-width: ${tabletScreen.min}px)`]: {
      gridTemplateColumns: isWithinTeam
        ? '1fr 1fr 1fr 1fr 1fr 1fr'
        : '0.3fr 1fr 1fr 1fr 1fr 1fr 1fr',
    },
  });

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    padding: `${rem(20)} ${rem(24)} 0`,
    paddingBottom: rem(16),
  },
});

const rowStyles = css({
  display: 'grid',
  borderBottom: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderBottom: 'none',
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: rem(15),
    borderRadius: rem(borderRadius),
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

export type CollaborationType = 'within-team' | 'across-teams';

export type TeamCollaborationMetric = {
  id: string;
  name: string;
  isInactive: boolean;
  Article: number;
  Bioinformatics: number;
  Dataset: number;
  'Lab Resource': number;
  Protocol: number;
  collaborationByTeam: Omit<
    TeamCollaborationMetric,
    'collaborationByTeam' | 'type'
  >[];
  type: CollaborationType;
};

type TeamCollaborationTableProps = ComponentProps<typeof PageControls> & {
  data: TeamCollaborationMetric[];
  performance: PerformanceMetricByDocumentType;
};

const TeamCollaborationTable: React.FC<TeamCollaborationTableProps> = ({
  data,
  performance,
  ...pageControlProps
}) => (
  <>
    <PerformanceCard performance={performance} type="by-document" />
    <Card padding={false}>
      <div css={container}>
        <div
          css={[
            rowStyles,
            gridTitleStyles,
            columnsStyles(data[0]?.type === 'within-team'),
          ]}
        >
          <span
            css={
              titleStyles &&
              data[0]?.type === 'within-team' && { display: 'none' }
            }
          ></span>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>Articles</span>
          <span css={titleStyles}>Bioinformatics</span>
          <span css={titleStyles}>Datasets</span>
          <span css={titleStyles}>Lab Resources</span>
          <span css={titleStyles}>Protocols</span>
        </div>
        {data.map((row) => (
          <TeamCollaborationRow
            rowItem={row}
            key={row.id}
            performance={performance}
          />
        ))}
      </div>
    </Card>
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </>
);

export default TeamCollaborationTable;

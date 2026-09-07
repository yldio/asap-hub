import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Card, Paragraph, Subtitle } from '../atoms';
import { charcoal, lead, steel } from '../colors';
import { minusRectIcon, plusRectIcon } from '../icons';
import { ExpandableText } from '../molecules';
import { rem, tabletScreen } from '../pixels';

const gridTemplateColumns = `${rem(24)} minmax(0, 1fr) ${rem(64)}`;

const CARD_INLINE_PADDING = 24;

const cardStyles = css({
  padding: `${rem(32)} ${rem(CARD_INLINE_PADDING)}`,
});

const headerStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'grid',
    gridTemplateColumns,
    columnGap: rem(16),
    paddingBottom: rem(16),
  },
});

const headerMetricStyles = css({
  gridColumn: 2,
});

const rowStyles = css({
  paddingBlock: rem(32),
  marginInline: rem(-CARD_INLINE_PADDING),
  paddingInline: rem(CARD_INLINE_PADDING),
  '&:first-of-type': {
    paddingTop: 0,
  },
  '&:last-of-type': {
    paddingBottom: 0,
  },
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${steel.rgb}`,
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'grid',
    gridTemplateColumns,
    columnGap: rem(16),
    alignItems: 'center',
    paddingTop: rem(20),
    marginInline: 0,
    paddingInline: 0,
  },
});

const rowHeaderStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: rem(16),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'contents',
  },
});

const iconButtonStyles = css({
  display: 'none',
  lineHeight: 0,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inline-flex',
  },
});

const fieldStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
  color: lead.rgb,
  fontSize: rem(17),
  lineHeight: rem(24),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'block',
  },
});

const fieldLabelStyles = css({
  color: charcoal.rgb,
  fontWeight: 'bold',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'none',
  },
});

const detailsContentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

const desktopDetailsStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'block',
    gridColumn: 2,
    minWidth: 0,
    marginTop: rem(16),
  },
});

const mobileDetailsStyles = css({
  marginTop: rem(32),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'none',
  },
});

const definitionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  marginTop: rem(16),
});

export type TeamLeadershipMetricProps = {
  metric: string;
  philosophy: string;
  definition: string;
  value: boolean;
};

const MetricDetails: React.FC<
  Pick<TeamLeadershipMetricProps, 'philosophy' | 'definition'>
> = ({ philosophy, definition }) => (
  <div css={detailsContentStyles}>
    <div>
      <Subtitle accent="lead" noMargin>
        ASAP Philosophy
      </Subtitle>
      <Paragraph noMargin accent="lead">
        {philosophy}
      </Paragraph>
    </div>
    <div css={definitionStyles}>
      <Subtitle accent="lead" noMargin>
        Metric Definition
      </Subtitle>
      <Paragraph noMargin accent="lead">
        {definition}
      </Paragraph>
    </div>
  </div>
);

const TeamLeadershipMetric: React.FC<TeamLeadershipMetricProps> = ({
  metric,
  philosophy,
  definition,
  value,
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);

  return (
    <article css={rowStyles}>
      <div css={rowHeaderStyles}>
        <Button
          aria-label={expanded ? `Collapse ${metric}` : `Expand ${metric}`}
          aria-expanded={expanded}
          linkStyle
          onClick={toggleExpanded}
          overrideStyles={iconButtonStyles}
        >
          {expanded ? minusRectIcon : plusRectIcon}
        </Button>
        <div css={fieldStyles}>
          <span css={fieldLabelStyles}>Metric</span>
          <span>{metric}</span>
        </div>
        <div css={fieldStyles}>
          <span css={fieldLabelStyles}>Status</span>
          <span>{value ? 'Y' : 'N'}</span>
        </div>
      </div>
      {expanded && (
        <div
          css={desktopDetailsStyles}
          data-testid="team-leadership-details-desktop"
        >
          <MetricDetails philosophy={philosophy} definition={definition} />
        </div>
      )}

      <div
        css={mobileDetailsStyles}
        data-testid="team-leadership-details-mobile"
      >
        <ExpandableText variant="arrow" expandOnce>
          <MetricDetails philosophy={philosophy} definition={definition} />
        </ExpandableText>
      </div>
    </article>
  );
};

export type TeamLeadershipMetricsProps = {
  workingGroupLead: boolean;
  interestGroupLead: boolean;
};

const TeamLeadershipMetrics: React.FC<TeamLeadershipMetricsProps> = ({
  workingGroupLead,
  interestGroupLead,
}) => (
  <Card overrideStyles={cardStyles}>
    <div css={headerStyles}>
      <div css={headerMetricStyles}>
        <Subtitle noMargin>Metric</Subtitle>
      </div>
      <Subtitle noMargin>Status</Subtitle>
    </div>
    <TeamLeadershipMetric
      key="workingGroup"
      metric="Working Group(s) Lead"
      philosophy="ASAP believes in ensuring that credit is given to contributors."
      definition="The Working Group Leadership Metric recognizes the team for their current and/or prior leadership as a chair of a CRN working group."
      value={workingGroupLead}
    />
    <TeamLeadershipMetric
      key="interestGroup"
      metric="Interest Group(s) Lead"
      philosophy="ASAP believes in ensuring that credit is given to contributors."
      definition="The Interest Group Leadership Metric recognizes the team for their current and/or prior leadership as a chair of a CRN interest group."
      value={interestGroupLead}
    />
  </Card>
);

export default TeamLeadershipMetrics;

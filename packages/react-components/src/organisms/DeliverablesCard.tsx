import React, { ComponentProps, useState } from 'react';
import { WorkingGroupResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Button, Card, Headline3, Headline5, Paragraph, Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { steel } from '../colors';
import { paddingStyles } from '../card';

const statusToAccent: Record<
  WorkingGroupResponse['deliverables'][number]['status'],
  ComponentProps<typeof Pill>['accent']
> = {
  'In Progress': 'info',
  'Not Started': 'neutral',
  Complete: 'green',
  Pending: 'neutral',
};

const deliverablesRowStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  [`:nth-last-of-type(1)`]: { borderBottom: 'none' },
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    display: 'grid',
    gridTemplateColumns: `1fr ${rem(128)}`,
  },
});

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: rem(16),
  paddingBottom: rem(16),
  borderTop: `1px solid ${steel.rgb}`,
});

const mobileTitle = {
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    display: 'none',
  },
};
const desktopTitles = {
  display: 'none',
};

type DeliverablesCardProps = {
  deliverables: WorkingGroupResponse['deliverables'];
  limit?: number;
};
const DeliverablesCard: React.FC<DeliverablesCardProps> = ({
  deliverables,
  limit = 4,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card padding={false}>
      <div css={paddingStyles}>
        <Headline3>Purpose</Headline3>
        <Paragraph accent="lead">
          The deliverables of this working group are:
        </Paragraph>
        <div css={[deliverablesRowStyles, desktopTitles]}>
          <Headline5>Deliverables</Headline5>
          <Headline5>Status</Headline5>
        </div>
        {deliverables
          .slice(0, expanded ? undefined : limit)
          .map(({ description, status }, index) => (
            <div css={deliverablesRowStyles} key={`deliverable-${index}`}>
              <div css={mobileTitle}>
                <Headline5>Deliverables</Headline5>
              </div>
              <Paragraph accent="lead">{description}</Paragraph>
              <div css={mobileTitle}>
                <Headline5>Status</Headline5>
              </div>
              <div css={{ display: 'inline-block' }}>
                <Pill accent={statusToAccent[status]}>{status}</Pill>
              </div>
            </div>
          ))}
      </div>
      {deliverables.length > limit && (
        <div css={showMoreStyles}>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            View {expanded ? 'Less' : 'More'} Deliverables
          </Button>
        </div>
      )}
    </Card>
  );
};
export default DeliverablesCard;

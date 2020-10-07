import React from 'react';
import css from '@emotion/css';
import { TeamResponse } from '@asap-hub/model';

import { Display, Card, Link, Paragraph, Headline2 } from '../atoms';
import { mobileScreen } from '../pixels';

const stretchOnMobile = css({
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    display: 'flex',
    justifyContent: 'stretch',
  },
});

type TeamOverviewProps = Pick<
  TeamResponse,
  'projectTitle' | 'projectSummary'
> & {
  readonly proposalHref?: string;
};

const TeamOverview: React.FC<TeamOverviewProps> = ({
  projectSummary,
  projectTitle,
  proposalHref,
}) => {
  return (
    <Card>
      <div>
        <Display styleAsHeading={2}>Project Overview</Display>
        <Headline2 styleAsHeading={3}>{projectTitle}</Headline2>
        <Paragraph>{projectSummary}</Paragraph>
        {proposalHref ? (
          <div css={stretchOnMobile}>
            <Link buttonStyle primary href={proposalHref}>
              Read Full Proposal
            </Link>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default TeamOverview;

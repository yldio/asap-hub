import React from 'react';
import css from '@emotion/css';
import { TeamResponse } from '@asap-hub/model';

import { Display, Card, Link, Paragraph, Headline2 } from '../atoms';
import { mobileScreen } from '../pixels';

const stretchOnMobile = css({
  display: 'flex',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    flexDirection: 'column',
  },
});

type TeamOverviewProps = Pick<
  TeamResponse,
  'projectTitle' | 'projectSummary' | 'proposalURL'
>;

const TeamOverview: React.FC<TeamOverviewProps> = ({
  projectSummary,
  proposalURL,
  projectTitle,
}) => {
  return (
    <Card>
      <div>
        <Display styleAsHeading={2}>Project Overview</Display>
        <Headline2 styleAsHeading={3}>{projectTitle}</Headline2>
        <Paragraph>{projectSummary}</Paragraph>
        {proposalURL ? (
          <div css={stretchOnMobile}>
            <Link href={proposalURL}>Read Proposal</Link>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default TeamOverview;

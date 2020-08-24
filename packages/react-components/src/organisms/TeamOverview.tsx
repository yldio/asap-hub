import React from 'react';
import css from '@emotion/css';
import { TeamResponse } from '@asap-hub/model';

import { Card, Button, Paragraph, Headline2 } from '../atoms';
import { docsIcon } from '../icons';
import { mobileScreen } from '../pixels';

const stretchOnMobile = css({
  display: 'flex',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    flexDirection: 'column',
  },
});

type TeamOverviewProps = Pick<TeamResponse, 'projectTitle' | 'projectSummary'>;

const TeamOverview: React.FC<TeamOverviewProps> = ({
  projectSummary,
  projectTitle,
}) => {
  return (
    <Card>
      <div>
        <Headline2 styleAsHeading={3}>Project Overview</Headline2>
        <Headline2 styleAsHeading={3}>{projectTitle}</Headline2>
        <Paragraph>{projectSummary}</Paragraph>
        <div css={stretchOnMobile}>
          <Button>
            {docsIcon}
            Read Proposal
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TeamOverview;

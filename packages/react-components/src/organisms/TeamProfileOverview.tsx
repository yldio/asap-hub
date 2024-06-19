import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { sharedResearchRoutes } from '@asap-hub/routing';

import { Display, Card, Link, Paragraph, Headline2 } from '../atoms';
import { mobileScreen } from '../pixels';

const stretchOnMobile = css({
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    display: 'flex',
    justifyContent: 'stretch',
  },
});

type TeamProfileOverviewProps = Pick<
  TeamResponse,
  'projectTitle' | 'projectSummary' | 'proposalURL'
> & {
  readonly proposalURL?: string;
};

const TeamProfileOverview: React.FC<TeamProfileOverviewProps> = ({
  projectSummary,
  projectTitle,
  proposalURL,
}) => (
  <Card>
    <div>
      <Display styleAsHeading={3}>Project Overview</Display>
      <Headline2 styleAsHeading={4}>{projectTitle}</Headline2>
      <Paragraph>{projectSummary}</Paragraph>
      {proposalURL ? (
        <div css={stretchOnMobile}>
          <Link
            buttonStyle
            primary
            href={sharedResearchRoutes.DEFAULT.DETAILS.buildPath({
              researchOutputId: proposalURL,
            })}
          >
            Read Full Proposal
          </Link>
        </div>
      ) : null}
    </div>
  </Card>
);

export default TeamProfileOverview;

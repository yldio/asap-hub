import { TeamResponse } from '@asap-hub/model';
import React from 'react';
import { Headline2, Paragraph, Card } from '../atoms';
import { ExpandableText, TeamProfileTags } from '../molecules';

type TeamProfileOverviewProps = Pick<
  TeamResponse,
  'projectSummary' | 'tags' | 'teamDescription'
>;

type TeamProfileOverviewContentProps = {
  description: TeamResponse['projectSummary'];
};
const TeamProfileOverviewContent: React.FC<TeamProfileOverviewContentProps> = ({
  description,
}) => (
  <>
    <Headline2 styleAsHeading={3}>Team Description</Headline2>
    <ExpandableText variant="arrow">
      <Paragraph>{description}</Paragraph>
    </ExpandableText>
  </>
);

const TeamProfileOverview: React.FC<TeamProfileOverviewProps> = ({
  tags,
  teamDescription,
}) => (
  <Card>
    <div>
      <TeamProfileOverviewContent description={teamDescription} />
      {tags && tags.length ? <TeamProfileTags tags={tags} /> : null}
    </div>
  </Card>
);

export default TeamProfileOverview;

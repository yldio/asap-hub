import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import React from 'react';
import { Headline2, Paragraph, Card, Pill } from '../atoms';
import { ExpandableText, TeamProfileTags } from '../molecules';
import { rem } from '../pixels';

const pillsStyles = css({
  display: 'flex',
  gap: rem(8),
  marginBottom: rem(12),
});

type TeamProfileOverviewProps = Pick<TeamResponse, 'tags' | 'teamDescription'> &
  Partial<Pick<TeamResponse, 'teamType' | 'researchTheme' | 'resourceType'>>;

type TeamProfileOverviewContentProps = {
  description: TeamResponse['teamDescription'];
  teamType?: TeamResponse['teamType'];
  researchTheme?: TeamResponse['researchTheme'];
  resourceType?: TeamResponse['resourceType'];
};

const TeamProfileOverviewContent: React.FC<TeamProfileOverviewContentProps> = ({
  description,
  teamType,
  researchTheme,
  resourceType,
}) => (
  <>
    {(teamType || researchTheme || resourceType) && (
      <div css={pillsStyles}>
        {teamType && <Pill noMargin>{teamType}</Pill>}
        {researchTheme && <Pill noMargin>{researchTheme}</Pill>}
        {resourceType && <Pill noMargin>{resourceType}</Pill>}
      </div>
    )}
    <Headline2 styleAsHeading={3}>Team Description</Headline2>
    <ExpandableText variant="arrow">
      <Paragraph>{description}</Paragraph>
    </ExpandableText>
  </>
);

const TeamProfileOverview: React.FC<TeamProfileOverviewProps> = ({
  tags,
  teamDescription,
  teamType,
  researchTheme,
  resourceType,
}) => (
  <Card>
    <div>
      <TeamProfileOverviewContent
        description={teamDescription}
        teamType={teamType}
        researchTheme={researchTheme}
        resourceType={resourceType}
      />
      {tags && tags.length ? <TeamProfileTags tags={tags} /> : null}
    </div>
  </Card>
);

export default TeamProfileOverview;

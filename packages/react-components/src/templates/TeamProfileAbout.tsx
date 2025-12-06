import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';

import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  TeamMembersTabbedCard,
  TeamProfileOverview,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

const styles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

const membersCardStyles = css({
  overflow: 'hidden',
});

type TeamProfileAboutProps = ComponentProps<typeof TeamProfileOverview> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<
    TeamResponse,
    'pointOfContact' | 'members' | 'inactiveSince' | 'supplementGrant' | 'teamStatus' | 'teamType'
  > & {
    teamGroupsCard?: React.ReactNode;
    readonly teamListElementId: string;
  };

const TeamProfileAbout: React.FC<TeamProfileAboutProps> = ({
  inactiveSince,
  projectTitle,
  projectSummary,
  tags,
  pointOfContact,
  members,
  proposalURL,
  teamGroupsCard,
  teamListElementId,
  supplementGrant,
  teamStatus,
  teamType,
}) => (
  <div css={styles}>
    {projectTitle ? (
      <TeamProfileOverview
        supplementGrant={supplementGrant}
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        proposalURL={proposalURL}
        tags={tags}
      />
    ) : null}
    {tags && tags.length ? (
      <ProfileExpertiseAndResources hideExpertiseAndResources tags={tags} />
    ) : null}
    <section id={teamListElementId} css={membersCardStyles}>
      <TeamMembersTabbedCard
        title="Team Members"
        members={members}
        isTeamInactive={!!inactiveSince}
      />
    </section>
    {teamType !== 'Resource Team' && teamGroupsCard}
    {pointOfContact && (
      <CtaCard
        href={createMailTo(pointOfContact.email)}
        buttonText="Contact"
        displayCopy
      >
        <strong>Have additional questions?</strong>
        <br /> Members are here to help.
      </CtaCard>
    )}
  </div>
);

export default TeamProfileAbout;

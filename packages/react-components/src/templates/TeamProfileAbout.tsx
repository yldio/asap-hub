import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';

import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  TeamLabsCard,
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
    | 'pointOfContact'
    | 'members'
    | 'inactiveSince'
    | 'supplementGrant'
    | 'teamStatus'
    | 'teamType'
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
    {supplementGrant && tags && tags.length ? (
      <ProfileExpertiseAndResources hideExpertiseAndResources tags={tags} />
    ) : null}
    {isEnabled('TEAM_LABS_CARD') &&
    pointOfContact &&
    pointOfContact.labs &&
    pointOfContact.labs.length ? (
      <TeamLabsCard
        labs={pointOfContact.labs}
        isTeamActive={teamStatus === 'Active'}
        pointOfContactId={pointOfContact.id}
      />
    ) : null}
    <section id={teamListElementId} css={membersCardStyles}>
      <TeamMembersTabbedCard
        title="Team Members"
        members={members}
        isTeamInactive={!!inactiveSince}
      />
    </section>
    {teamType !== 'Resource Team' && teamStatus === 'Active' && teamGroupsCard}
    {pointOfContact && teamStatus === 'Active' && (
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

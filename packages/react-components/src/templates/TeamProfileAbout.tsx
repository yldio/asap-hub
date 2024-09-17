import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  TeamMembersTabbedCard,
  TeamProfileOverview,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

const membersCardStyles = css({
  overflow: 'hidden',
});

type TeamProfileAboutProps = ComponentProps<typeof TeamProfileOverview> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<
    TeamResponse,
    'pointOfContact' | 'members' | 'inactiveSince' | 'supplementGrant'
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
}) => (
  <div css={styles}>
    {projectTitle ? (
      <TeamProfileOverview
        supplementGrant={supplementGrant}
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        proposalURL={proposalURL}
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
    {teamGroupsCard}
    {pointOfContact && (
      <CtaCard
        href={createMailTo(pointOfContact.email)}
        buttonText="Contact PM"
        displayCopy
      >
        <strong>Have additional questions?</strong>
        <br /> The project manager is here to help.
      </CtaCard>
    )}
  </div>
);

export default TeamProfileAbout;

import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import {
  TeamMembersSection,
  ProfileExpertiseAndResources,
  TeamProfileOverview,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type TeamProfileAboutProps = ComponentProps<typeof TeamProfileOverview> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Omit<ComponentProps<typeof TeamMembersSection>, 'title'> &
  Pick<TeamResponse, 'pointOfContact'> & {
    teamGroupsCard?: React.ReactNode;
    readonly teamListElementId: string;
  };

const TeamProfileAbout: React.FC<TeamProfileAboutProps> = ({
  projectTitle,
  projectSummary,
  expertiseAndResourceTags,
  pointOfContact,
  members,
  proposalURL,
  teamGroupsCard,
  teamListElementId,
}) => (
  <div css={styles}>
    {projectTitle ? (
      <TeamProfileOverview
        projectTitle={projectTitle}
        projectSummary={projectSummary}
        proposalURL={proposalURL}
      />
    ) : null}
    {expertiseAndResourceTags.length ? (
      <ProfileExpertiseAndResources
        expertiseAndResourceTags={expertiseAndResourceTags}
      />
    ) : null}
    {members.length ? (
      <section id={teamListElementId}>
        <TeamMembersSection members={members} />
      </section>
    ) : null}
    {teamGroupsCard}
    {pointOfContact && (
      <CtaCard
        href={createMailTo(pointOfContact.email)}
        buttonText="Contact PM"
      >
        <strong>Interested in what you have seen?</strong>
        <br /> Reach out to this team and see how you can collaborate
      </CtaCard>
    )}
  </div>
);

export default TeamProfileAbout;

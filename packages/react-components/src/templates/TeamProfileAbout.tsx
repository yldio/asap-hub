import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import {
  TeamMembersSection,
  ProfileExpertiseAndResources,
  TeamProfileOverview,
  TeamMembersTabbedCard,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';
import { getUniqueCommaStringWithSuffix } from '../utils/text';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type TeamProfileAboutProps = ComponentProps<typeof TeamProfileOverview> &
  ComponentProps<typeof ProfileExpertiseAndResources> &
  Pick<TeamResponse, 'pointOfContact' | 'members' | 'inactiveSince'> & {
    teamGroupsCard?: React.ReactNode;
    readonly teamListElementId: string;
  };

const TeamProfileAbout: React.FC<TeamProfileAboutProps> = ({
  inactiveSince,
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
      inactiveSince ? (
        <TeamMembersTabbedCard title="Team Members" members={members} />
      ) : (
        <section id={teamListElementId}>
          <TeamMembersSection
            members={members.map(
              ({
                displayName,
                role,
                firstName,
                lastName,
                avatarUrl,
                id,
                labs = [],
              }) => ({
                firstLine: displayName,
                secondLine: role,
                thirdLine: getUniqueCommaStringWithSuffix(
                  labs.map((lab) => lab.name),
                  'Lab',
                ),
                avatarUrl,
                firstName,
                lastName,
                id,
              }),
            )}
          />
        </section>
      )
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

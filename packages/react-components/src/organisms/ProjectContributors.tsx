import { ProjectMember, TeamDetail } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Card, Headline3, Pill, TabButton } from '../atoms';
import { lead, steel } from '../colors';
import { TabNav, ProjectMembers, LinkHeadline } from '../molecules';
import { rem } from '../pixels';

const cardContentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const tabsContainerStyles = css({
  display: 'flex',
  borderBottom: `1px solid ${steel.rgb}`,
  marginTop: rem(8),
});

const tabContentStyles = css({
  paddingTop: rem(24),
});

const teamSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

const teamHeaderStyles = css({
  display: 'flex',
  gap: rem(12),
  flexWrap: 'wrap',
});

const teamDescriptionStyles = css({
  color: lead.rgb,
  fontSize: rem(17),
  lineHeight: rem(24),
  margin: 0,
});

type ProjectContributorsProps =
  | {
      fundedTeam: TeamDetail;
      collaborators?: ReadonlyArray<ProjectMember>;
      projectMembers?: never;
      showTeamInfo?: never;
    }
  | {
      fundedTeam?: never;
      collaborators?: never;
      projectMembers: ReadonlyArray<ProjectMember>;
      /** Show team info (true for trainee, false for resource not team-based) */
      showTeamInfo?: boolean;
    };

export const tabs = ['Funded Team', 'Collaborators'] as const;
export const memberTabs = ['Project Members'] as const;

export type Tabs = (typeof tabs)[number];
export type MemberTabs = (typeof memberTabs)[number];

const ProjectContributors: React.FC<ProjectContributorsProps> = ({
  fundedTeam,
  projectMembers,
  showTeamInfo = false,
}) => {
  if (projectMembers) {
    // Trainee or Resource individual-based projects - show Project Members only
    return (
      <Card padding={false}>
        <div css={cardContentStyles}>
          <Headline3 noMargin>Contributors</Headline3>
          <div css={tabsContainerStyles}>
            <TabNav>
              <TabButton active={true}>Project Members</TabButton>
            </TabNav>
          </div>
          <div css={tabContentStyles}>
            <ProjectMembers
              members={projectMembers}
              showTeamInfo={showTeamInfo}
            />
          </div>
        </div>
      </Card>
    );
  }

  if (!fundedTeam) {
    return null;
  }

  return (
    <Card padding={false}>
      <div css={cardContentStyles}>
        <Headline3 noMargin>Contributors</Headline3>

        <>
          <div css={tabsContainerStyles}>
            <TabNav>
              <TabButton active={true}>Funded Team</TabButton>
            </TabNav>
          </div>
          <div css={tabContentStyles}>
            <div css={teamSectionStyles}>
              <div css={teamHeaderStyles}>
                <Pill noMargin>{fundedTeam.type}</Pill>
                {fundedTeam.researchTheme && (
                  <Pill noMargin>{fundedTeam.researchTheme}</Pill>
                )}
              </div>
              <LinkHeadline href={'#'} level={3} styleAsHeading={4} noMargin>
                {fundedTeam.name}
              </LinkHeadline>
              <p css={teamDescriptionStyles}>{fundedTeam.description}</p>
            </div>
          </div>
        </>
      </div>
    </Card>
  );
};

export default ProjectContributors;

import {
  CollaboratingMember,
  CollaboratingTeam,
  FundedTeam,
  ProjectMember,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Card, Headline3, Paragraph, Pill, TabButton } from '../atoms';
import { lead, steel } from '../colors';
import {
  TabNav,
  ProjectMembers,
  LinkHeadline,
  CollaboratingMembers,
  CollaboratingTeams,
} from '../molecules';
import { rem } from '../pixels';

const cardContentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const subtitleStyles = css({
  marginTop: rem(24),
  marginBottom: rem(12),
});

const tabsContainerStyles = css({
  display: 'flex',
  borderBottom: `1px solid ${steel.rgb}`,
  marginTop: rem(8),
});

const tabContentStyles = css({
  paddingTop: rem(32),
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
      fundedTeam: FundedTeam;
      collaborators?: ReadonlyArray<ProjectMember>;
      collaboratingTeams?: ReadonlyArray<CollaboratingTeam>;
      collaboratingMembers?: ReadonlyArray<CollaboratingMember>;
      projectMembers?: never;
      showTeamInfo?: never;
    }
  | {
      fundedTeam?: never;
      collaborators?: never;
      collaboratingTeams?: never;
      collaboratingMembers?: ReadonlyArray<CollaboratingMember>;
      projectMembers: ReadonlyArray<ProjectMember>;
      /** Show team info (true for trainee, false for resource not team-based) */
      showTeamInfo?: boolean;
    };

export const tabs = ['Funded Team', 'Collaborators'] as const;
export const memberTabs = ['Project Members', 'Collaborators'] as const;

export type Tabs = (typeof tabs)[number];
export type MemberTabs = (typeof memberTabs)[number];

const ProjectContributors: React.FC<ProjectContributorsProps> = ({
  fundedTeam,
  collaboratingTeams,
  collaboratingMembers,
  projectMembers,
  showTeamInfo = false,
}) => {
  const [activeTab, setActiveTab] = useState<Tabs>('Funded Team');
  const [activeMemberTab, setActiveMemberTab] =
    useState<MemberTabs>('Project Members');

  if (projectMembers) {
    const memberCollaboratorsCount = collaboratingMembers?.length ?? 0;
    const showCollaboratorsTab = collaboratingMembers !== undefined;

    return (
      <Card padding={false}>
        <div css={cardContentStyles}>
          <Headline3 noMargin>Contributors</Headline3>
          <div css={tabsContainerStyles}>
            <TabNav>
              <TabButton
                active={activeMemberTab === 'Project Members'}
                onClick={() => setActiveMemberTab('Project Members')}
              >
                Project Members
              </TabButton>
              {showCollaboratorsTab && (
                <TabButton
                  active={activeMemberTab === 'Collaborators'}
                  onClick={() => setActiveMemberTab('Collaborators')}
                >
                  Collaborators ({memberCollaboratorsCount})
                </TabButton>
              )}
            </TabNav>
          </div>
          <div css={tabContentStyles}>
            {activeMemberTab === 'Project Members' ? (
              <ProjectMembers
                members={projectMembers}
                showTeamInfo={showTeamInfo}
              />
            ) : (
              <CollaboratingMembers
                collaboratingMembers={collaboratingMembers}
              />
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (!fundedTeam) {
    return null;
  }

  const collaboratorsCount = collaboratingTeams?.length ?? 0;

  return (
    <Card padding={false}>
      <div css={cardContentStyles}>
        <Headline3 noMargin>Contributors</Headline3>
        <Paragraph noMargin accent="lead" styles={subtitleStyles}>
          View the funded team leading this project and the teams that have
          collaborated on its articles.
        </Paragraph>

        <div css={tabsContainerStyles}>
          <TabNav>
            <TabButton
              active={activeTab === 'Funded Team'}
              onClick={() => setActiveTab('Funded Team')}
            >
              Funded Team
            </TabButton>
            <TabButton
              active={activeTab === 'Collaborators'}
              onClick={() => setActiveTab('Collaborators')}
            >
              Collaborators ({collaboratorsCount})
            </TabButton>
          </TabNav>
        </div>
        <div css={tabContentStyles}>
          {activeTab === 'Funded Team' ? (
            <div css={teamSectionStyles}>
              <div css={teamHeaderStyles}>
                <Pill noMargin>{fundedTeam.teamType}</Pill>
                {fundedTeam.researchTheme && (
                  <Pill noMargin>{fundedTeam.researchTheme}</Pill>
                )}
              </div>
              <LinkHeadline
                href={`/network/teams/${fundedTeam.id}`}
                level={3}
                styleAsHeading={4}
                noMargin
              >
                {fundedTeam.displayName}
              </LinkHeadline>
              <p css={teamDescriptionStyles}>{fundedTeam.teamDescription}</p>
            </div>
          ) : (
            <CollaboratingTeams collaboratingTeams={collaboratingTeams} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectContributors;

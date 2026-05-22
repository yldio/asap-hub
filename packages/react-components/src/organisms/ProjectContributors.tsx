import { CollaboratingTeam, FundedTeam, ProjectMember } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Card, Headline3, Link, Pill, TabButton } from '../atoms';
import { lead, steel } from '../colors';
import {
  article as articleIcon,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
  InactiveBadgeIcon,
  chevronUpIcon,
  chevronDownIcon,
} from '../icons';
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

const collaboratorsListStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

const collaboratorRowStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderTop: 'none',
  },
  ':last-of-type': {
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const collaboratorHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
  padding: `${rem(16)} 0`,
  cursor: 'pointer',
});

const chevronButtonStyles = css({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
});

const collaboratorHeaderLeftStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  flexWrap: 'wrap',
});

const collaboratorNameStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
});

const articleCountStyles = css({
  color: lead.rgb,
});

const ARTICLES_BEFORE_SCROLL = 7;
const ARTICLE_ROW_HEIGHT = 40;

const articlesListStyles = (count: number) =>
  css({
    listStyle: 'none',
    margin: 0,
    padding: `0 0 ${rem(16)} ${rem(28)}`,
    display: 'flex',
    flexDirection: 'column',
    gap: rem(8),
    ...(count > ARTICLES_BEFORE_SCROLL
      ? {
          maxHeight: rem(ARTICLES_BEFORE_SCROLL * ARTICLE_ROW_HEIGHT),
          overflowY: 'auto',
        }
      : {}),
  });

const articleRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const emptyStateStyles = css({
  color: lead.rgb,
  margin: 0,
  padding: `${rem(24)} 0`,
  textAlign: 'center',
});

const viewMoreContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: rem(16),
});

const INITIAL_COLLABORATORS_COUNT = 10;

const articleTypeLabel = (type?: string) => {
  if (!type) return undefined;
  if (type === 'Published') return 'Publication';
  return type;
};

type ProjectContributorsProps =
  | {
      fundedTeam: FundedTeam;
      collaborators?: ReadonlyArray<ProjectMember>;
      collaboratingTeams?: ReadonlyArray<CollaboratingTeam>;
      projectMembers?: never;
      showTeamInfo?: never;
    }
  | {
      fundedTeam?: never;
      collaborators?: never;
      collaboratingTeams?: never;
      projectMembers: ReadonlyArray<ProjectMember>;
      /** Show team info (true for trainee, false for resource not team-based) */
      showTeamInfo?: boolean;
    };

export const tabs = ['Funded Team', 'Collaborators'] as const;
export const memberTabs = ['Project Members'] as const;

export type Tabs = (typeof tabs)[number];
export type MemberTabs = (typeof memberTabs)[number];

const CollaboratingTeamRow: React.FC<{
  team: CollaboratingTeam;
  TeamTypeIcon: React.FC;
}> = ({ team, TeamTypeIcon }) => {
  const [expanded, setExpanded] = useState(false);
  const articleCount = team.articles.length;

  const toggle = () => setExpanded((v) => !v);

  return (
    <div css={collaboratorRowStyles}>
      <div
        css={collaboratorHeaderStyles}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={
          expanded
            ? `Collapse ${team.displayName} articles`
            : `Expand ${team.displayName} articles`
        }
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <span css={collaboratorHeaderLeftStyles}>
          <span aria-hidden="true">
            <TeamTypeIcon />
          </span>
          <span
            css={collaboratorNameStyles}
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
              {team.displayName}
            </Link>
            {team.inactiveSince && <InactiveBadgeIcon />}
          </span>
          <span css={articleCountStyles}>
            {' '}
            • {articleCount} {articleCount === 1 ? 'Article' : 'Articles'}
          </span>
        </span>
        <span css={chevronButtonStyles} aria-hidden="true">
          {expanded ? chevronUpIcon : chevronDownIcon}
        </span>
      </div>
      {expanded && (
        <ul css={articlesListStyles(articleCount)}>
          {team.articles.map((article) => {
            const label = articleTypeLabel(article.type);
            return (
              <li key={article.id} css={articleRowStyles}>
                <span aria-hidden="true">{articleIcon}</span>
                <Link
                  href={
                    sharedResearch({}).researchOutput({
                      researchOutputId: article.id,
                    }).$
                  }
                >
                  {article.title}
                </Link>
                {label && (
                  <Pill noMargin accent="gray">
                    {label}
                  </Pill>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const ProjectContributors: React.FC<ProjectContributorsProps> = ({
  fundedTeam,
  collaboratingTeams,
  projectMembers,
  showTeamInfo = false,
}) => {
  const [activeTab, setActiveTab] = useState<Tabs>('Funded Team');
  const [showAllCollaborators, setShowAllCollaborators] = useState(false);

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

  const collaboratorsCount = collaboratingTeams?.length ?? 0;
  const visibleCollaborators =
    showAllCollaborators || collaboratorsCount <= INITIAL_COLLABORATORS_COUNT
      ? collaboratingTeams ?? []
      : (collaboratingTeams ?? []).slice(0, INITIAL_COLLABORATORS_COUNT);
  const hasMoreCollaborators = collaboratorsCount > INITIAL_COLLABORATORS_COUNT;
  const TeamTypeIcon =
    fundedTeam.teamType === 'Resource Team'
      ? ResourceTeamIcon
      : DiscoveryTeamIcon;

  return (
    <Card padding={false}>
      <div css={cardContentStyles}>
        <Headline3 noMargin>Contributors</Headline3>

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
          ) : collaboratorsCount === 0 ? (
            <p css={emptyStateStyles}>
              There are no team collaborations on this project yet.
            </p>
          ) : (
            <>
              <div css={collaboratorsListStyles}>
                {visibleCollaborators.map((team) => (
                  <CollaboratingTeamRow
                    key={team.id}
                    team={team}
                    TeamTypeIcon={TeamTypeIcon}
                  />
                ))}
              </div>
              {hasMoreCollaborators && (
                <div css={viewMoreContainerStyles}>
                  <Button
                    linkStyle
                    onClick={() => setShowAllCollaborators((v) => !v)}
                  >
                    {showAllCollaborators
                      ? 'View Less Collaborators'
                      : 'View More Collaborators'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectContributors;

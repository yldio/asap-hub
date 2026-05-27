import { CollaboratingTeam } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Link, Pill } from '../atoms';
import { lead, steel } from '../colors';
import {
  article as articleIcon,
  DiscoveryTeamIcon,
  ResourceTeamIcon,
  InactiveBadgeIcon,
  chevronUpIcon,
  chevronDownIcon,
} from '../icons';
import { rem, tabletScreen } from '../pixels';

const nonMobileQuery = `@media (min-width: ${tabletScreen.min}px)`;

const listStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

const rowStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `${rem(16)} 0`,
  ':first-of-type': {
    borderTop: 'none',
    paddingTop: 8,
  },
});

const headerStyles = css({
  display: 'flex',
  // Mobile: chevron aligns to the bottom line (the article count).
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: rem(12),
  cursor: 'pointer',
  [nonMobileQuery]: {
    alignItems: 'center',
  },
});

const chevronStyles = css({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
});

const headerLeftStyles = css({
  display: 'flex',
  // Mobile: team name on the first line, article count on the next.
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(8),
  [nonMobileQuery]: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

const teamNameGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(8),
});

const teamNameStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
});

const articleCountStyles = css({
  color: lead.rgb,
  paddingLeft: rem(22),
  '& > [data-bullet]': {
    display: 'none',
  },
  [nonMobileQuery]: {
    paddingLeft: 0,
    '& > [data-bullet]': {
      display: 'inline',
    },
  },
});

const ARTICLES_BEFORE_SCROLL = 7;
const ARTICLE_ROW_HEIGHT = 40;

const articlesListStyles = (count: number) =>
  css({
    listStyle: 'none',
    margin: 0,
    padding: `${rem(0)} ${rem(12)} ${rem(20)} ${rem(32)}`,
    marginRight: rem(4),
    display: 'flex',
    flexDirection: 'column',
    marginBlockStart: rem(16),
    gap: rem(16),
    ...(count > ARTICLES_BEFORE_SCROLL
      ? {
          maxHeight: rem(ARTICLES_BEFORE_SCROLL * ARTICLE_ROW_HEIGHT),
          overflowY: 'auto',
        }
      : {}),
  });

const articleRowStyles = css({
  // Mobile: title row on top, pill flush-left underneath.
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0,
  [nonMobileQuery]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(8),
  },
});

const articleTitleGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(8),
});

const emptyStateStyles = css({
  color: lead.rgb,
  margin: 0,
  padding: `${rem(24)} 0`,
  textAlign: 'left',
});

const viewMoreContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  marginTop: rem(16),
  paddingTop: rem(14),
  // Negative horizontal margins cancel the parent card's 24px horizontal
  // padding so the divider spans the full card width.
  marginInline: `-${rem(24)}`,
  marginBottom: `-${rem(14)}`,
  borderTop: `1px solid ${steel.rgb}`,
});

const INITIAL_COLLABORATORS_COUNT = 10;

const articleTypeLabel = (type?: string) => {
  if (!type) return undefined;
  if (type === 'Published') return 'Publication';
  return type;
};

const teamTypeIconFor = (teamType?: string): React.FC =>
  teamType === 'Resource Team' ? ResourceTeamIcon : DiscoveryTeamIcon;

const CollaboratingTeamRow: React.FC<{ team: CollaboratingTeam }> = ({
  team,
}) => {
  const TeamTypeIcon = teamTypeIconFor(team.teamType);
  const [expanded, setExpanded] = useState(false);
  const articleCount = team.articles.length;

  const toggle = () => setExpanded((v) => !v);

  return (
    <div css={rowStyles}>
      <div
        css={headerStyles}
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
        <span css={headerLeftStyles}>
          <span css={teamNameGroupStyles}>
            <span aria-hidden="true">
              <TeamTypeIcon />
            </span>
            <span css={teamNameStyles} onClick={(e) => e.stopPropagation()}>
              <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
                {team.displayName}
              </Link>
              {team.inactiveSince && <InactiveBadgeIcon />}
            </span>
          </span>
          <span css={articleCountStyles}>
            <span data-bullet aria-hidden="true">
              {'• '}
            </span>
            {articleCount} {articleCount === 1 ? 'Article' : 'Articles'}
          </span>
        </span>
        <span css={chevronStyles} aria-hidden="true">
          {expanded ? chevronUpIcon : chevronDownIcon}
        </span>
      </div>
      {expanded && (
        <ul css={articlesListStyles(articleCount)}>
          {team.articles.map((article) => {
            const label = articleTypeLabel(article.type);
            return (
              <li key={article.id} css={articleRowStyles}>
                <span css={articleTitleGroupStyles}>
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
                </span>
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

type CollaboratingTeamsProps = {
  collaboratingTeams?: ReadonlyArray<CollaboratingTeam>;
  emptyStateMessage?: string;
};

const CollaboratingTeams: React.FC<CollaboratingTeamsProps> = ({
  collaboratingTeams,
  emptyStateMessage = 'There are no team collaborations on this project yet.',
}) => {
  const [showAll, setShowAll] = useState(false);

  const count = collaboratingTeams?.length ?? 0;
  if (count === 0) {
    return <p css={emptyStateStyles}>{emptyStateMessage}</p>;
  }

  const teams = collaboratingTeams ?? [];
  const visibleTeams =
    showAll || count <= INITIAL_COLLABORATORS_COUNT
      ? teams
      : teams.slice(0, INITIAL_COLLABORATORS_COUNT);
  const hasMore = count > INITIAL_COLLABORATORS_COUNT;

  return (
    <>
      <div css={listStyles}>
        {visibleTeams.map((team) => (
          <CollaboratingTeamRow key={team.id} team={team} />
        ))}
      </div>
      {hasMore && (
        <div css={viewMoreContainerStyles}>
          <Button linkStyle onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'View Less Collaborators' : 'View More Collaborators'}
          </Button>
        </div>
      )}
    </>
  );
};

export default CollaboratingTeams;

import { CollaboratingMember } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Avatar, Link, Pill } from '../atoms';
import { lead } from '../colors';
import {
  article as articleIcon,
  alumniBadgeIcon,
  chevronUpIcon,
  chevronDownIcon,
} from '../icons';
import { rem } from '../pixels';
import CollaboratingList, {
  nonMobileQuery,
  ARTICLES_BEFORE_SCROLL,
  ARTICLE_ROW_HEIGHT,
  articleTypeLabel,
  rowStyles,
  headerStyles,
  chevronStyles,
  articleRowStyles,
} from './CollaboratingList';

const headerLeftStyles = css({
  display: 'flex',
  // Mobile: member name on the first line, article count on the next.
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(8),
  minWidth: 0,
  flex: 1,
  [nonMobileQuery]: {
    gap: 0,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

const memberNameGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'flex-start',
  gap: rem(8),
  minWidth: 0,
  [nonMobileQuery]: {
    alignItems: 'center',
  },
});

const memberInfoStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minWidth: 0,
  [nonMobileQuery]: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: rem(6),
  },
});

const memberNameRowStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
});

const memberAvatarStyles = css({
  width: rem(32),
  minWidth: rem(32),
  margin: 0,
});

const teamNameStyles = css({
  color: lead.rgb,
  [nonMobileQuery]: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

const nameStyles = css({
  fontSize: rem(17),
  lineHeight: rem(24),
  fontWeight: 400,
});

const dotStyles = css({
  marginRight: rem(12),
  marginLeft: rem(12),
});

const articleCountStyles = css({
  color: lead.rgb,
  paddingLeft: rem(40),
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

const articlesListStyles = (count: number) =>
  css({
    listStyle: 'none',
    margin: 0,
    marginRight: rem(8),
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
    padding: `${rem(0)} ${rem(12)} ${rem(12)} ${rem(40)}`,
    [nonMobileQuery]: {
      padding: `${rem(0)} ${rem(12)} ${rem(12)} ${rem(32)}`,
    },
  });

const articleTitleGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'flex-start',
  gap: rem(8),
  minWidth: 0,
  [nonMobileQuery]: {
    alignItems: 'center',
    height: rem(24),
  },
});

const memberNameParts = (displayName: string) => {
  const [firstName, ...rest] = displayName.split(' ');
  return { firstName, lastName: rest.join(' ') };
};

const MemberTeamInfo = ({ member }: { member: CollaboratingMember }) => {
  if (member.teams.length === 0) {
    return null;
  }
  if (member.teams.length === 1) {
    return (
      <span css={teamNameStyles}>
        (
        <Link
          ellipsed
          href={
            network({})
              .teams({})
              .team({ teamId: member.teams[0]?.id || '' }).$
          }
        >
          <span css={nameStyles}>{member.teams[0]?.displayName}</span>
        </Link>
        )
      </span>
    );
  }

  return (
    <span css={teamNameStyles}>
      (
      <Link ellipsed href={network({}).users({}).user({ userId: member.id }).$}>
        <span css={nameStyles}>Multiple teams</span>
      </Link>
      )
    </span>
  );
};

const CollaboratingMemberRow: React.FC<{ member: CollaboratingMember }> = ({
  member,
}) => {
  const [expanded, setExpanded] = useState(false);
  const articleCount = member.articles.length;
  const { firstName, lastName } = memberNameParts(member.displayName);

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
            ? `Collapse ${member.displayName} articles`
            : `Expand ${member.displayName} articles`
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
          <span css={memberNameGroupStyles}>
            <span aria-hidden="true">
              <Avatar
                firstName={firstName}
                lastName={lastName}
                imageUrl={member.avatarUrl}
                overrideStyles={memberAvatarStyles}
              />
            </span>
            <span css={memberInfoStyles} onClick={(e) => e.stopPropagation()}>
              <span css={memberNameRowStyles}>
                <Link
                  href={network({}).users({}).user({ userId: member.id }).$}
                >
                  <span css={nameStyles}>{member.displayName}</span>
                </Link>

                {member.alumniSinceDate && alumniBadgeIcon}
              </span>

              <MemberTeamInfo member={member} />
            </span>
          </span>
          <span css={articleCountStyles}>
            <span data-bullet aria-hidden="true" css={dotStyles}>
              {'•'}
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
          {member.articles.map((article) => {
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

type CollaboratingMembersProps = {
  collaboratingMembers?: ReadonlyArray<CollaboratingMember>;
  emptyStateMessage?: string;
};

const CollaboratingMembers: React.FC<CollaboratingMembersProps> = ({
  collaboratingMembers,
  emptyStateMessage = 'There are no member collaborations on this project yet.',
}) => (
  <CollaboratingList
    items={collaboratingMembers}
    initialCount={8}
    emptyStateMessage={emptyStateMessage}
    renderRow={(member) => (
      <CollaboratingMemberRow key={member.id} member={member} />
    )}
  />
);

export default CollaboratingMembers;

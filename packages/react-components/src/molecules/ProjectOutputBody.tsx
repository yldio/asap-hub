import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';

import { Anchor, Avatar, Caption, Headline2, Link, StateTag } from '../atoms';
import ExternalLink from './ExternalLink';
import LinkHeadline from './LinkHeadline';
import PillList from './PillList';
import TagList from './TagList';
import UsersList from './UsersList';
import { formatDate } from '../date';
import { rem } from '../pixels';
import { DiscoveryProjectIcon, TeamIcon } from '../icons';

const PROJECT_ICON = <DiscoveryProjectIcon />;
const TEAM_ICON = <TeamIcon />;

export type ProjectOutput = Pick<
  ResearchOutputResponse,
  | 'published'
  | 'addedDate'
  | 'authors'
  | 'created'
  | 'documentType'
  | 'id'
  | 'link'
  | 'teams'
  | 'title'
  | 'type'
  | 'isInReview'
  | 'keywords'
> & {
  projects?: ReadonlyArray<{ id: string; title: string; href?: string }>;
  lastModifiedDate?: string;
  source?: 'team' | 'project';
};

const associationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: rem(16),
  marginTop: rem(16),
});

const metadataRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: rem(12),
  height: rem(32),
});

const listTagContainerStyles = css({
  marginTop: rem(24),
});

const listDatesStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: rem(12),
  '& > *': {
    lineHeight: rem(16),
  },
});

const associationRowStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: rem(8),
  rowGap: rem(8),
});

const associationIconStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  height: rem(24),
});

const associationItemStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: rem(8),
});

const associationBulletStyles = css({
  marginLeft: rem(8),
});

const counterStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: rem(8),
  marginLeft: rem(8),
});

const counterAvatarStyles = css({
  width: rem(24),
  flex: 'none',
});

const titleStyles = css({
  display: 'flex',
  columnGap: rem(15),
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: rem(16),
  marginBottom: rem(16),
});

const tagContainerStyles = css({
  marginTop: rem(24),
});

const datesStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: rem(12),
  marginTop: rem(24),
  '& > *': {
    lineHeight: rem(16),
  },
});

const dateSeparatorStyles = css({
  alignSelf: 'center',
});

type AssociationRowProps = {
  icon: React.ReactNode;
  items: ReadonlyArray<{ id: string; displayName: string; href?: string }>;
  max: number;
  label: 'Projects' | 'Teams';
  separator?: string;
};

const AssociationRow: React.FC<AssociationRowProps> = ({
  icon,
  items,
  max,
  label,
  separator,
}) => {
  const visible = items.slice(0, max);
  const remaining = items.length - visible.length;
  return (
    <div css={associationRowStyles}>
      <span css={associationIconStyles}>{icon}</span>
      {visible.map((item, index) => (
        <span key={item.id} css={associationItemStyles}>
          {item.href ? (
            <Link href={item.href}>{item.displayName}</Link>
          ) : (
            item.displayName
          )}
          {separator && index < visible.length - 1 && (
            <span css={associationBulletStyles}>{separator}</span>
          )}
        </span>
      ))}
      {remaining > 0 && (
        <span css={counterStyles}>
          <span css={counterAvatarStyles}>
            <Avatar placeholder={`+${remaining}`} />
          </span>
          <span>{label}</span>
        </span>
      )}
    </div>
  );
};

type ProjectOutputBodyProps = ProjectOutput & {
  variant: 'card' | 'list';
  showTags?: boolean;
};

const ProjectOutputBody: React.FC<ProjectOutputBodyProps> = ({
  id: researchOutputId,
  variant,
  source = 'project',
  created,
  addedDate,
  lastModifiedDate,
  teams,
  title,
  authors,
  type,
  documentType,
  link,
  published,
  isInReview,
  keywords,
  showTags = true,
  projects,
}) => (
  <>
    <div css={metadataRowStyles}>
      <PillList
        small
        pills={[
          'Project',
          ...(documentType ? [documentType] : []),
          ...(type ? [type] : []),
        ]}
      />
      {link && (
        <ExternalLink href={link} label="Access Output" size="large" noMargin />
      )}
    </div>
    <div css={titleStyles}>
      {variant === 'card' ? (
        <LinkHeadline
          level={2}
          styleAsHeading={4}
          href={sharedResearch({}).researchOutput({ researchOutputId }).$}
        >
          {title}
        </LinkHeadline>
      ) : (
        <Anchor
          href={sharedResearch({}).researchOutput({ researchOutputId }).$}
        >
          <Headline2 styleAsHeading={5}>{title}</Headline2>
        </Anchor>
      )}
      {!published && (
        <StateTag
          label={isInReview ? 'In Review' : 'Draft'}
          accent={isInReview ? 'blue' : undefined}
        />
      )}
    </div>
    <UsersList
      max={3}
      noMargin
      users={authors.map((author) => ({
        ...author,
        href:
          'id' in author
            ? network({}).users({}).user({ userId: author.id }).$
            : /* istanbul ignore next */ undefined,
      }))}
    />
    <div css={associationStyles}>
      {projects && projects.length > 0 && (
        <AssociationRow
          icon={PROJECT_ICON}
          max={1}
          label="Projects"
          items={projects.map(({ id, title: displayName, href }) => ({
            id,
            displayName,
            href,
          }))}
        />
      )}
      {source === 'team' && teams.length > 0 && (
        <AssociationRow
          icon={TEAM_ICON}
          max={3}
          label="Teams"
          separator="•"
          items={teams.map(({ id, displayName }) => ({
            id,
            displayName: `Team ${displayName}`,
            href: network({}).teams({}).team({ teamId: id }).$,
          }))}
        />
      )}
    </div>
    {showTags && keywords.length > 0 && (
      <div
        css={variant === 'list' ? listTagContainerStyles : tagContainerStyles}
      >
        <TagList max={3} tags={keywords} />
      </div>
    )}
    <div css={variant === 'list' ? listDatesStyles : datesStyles}>
      <Caption accent={'lead'} asParagraph>
        Date Added: {formatDate(new Date(addedDate || created))}
      </Caption>
      <Caption accent={'lead'} asParagraph>
        <span css={dateSeparatorStyles}>• </span>
        Last Updated:{' '}
        {formatDate(new Date(lastModifiedDate || addedDate || created))}
      </Caption>
    </div>
  </>
);

export default ProjectOutputBody;

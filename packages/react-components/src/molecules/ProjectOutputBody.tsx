import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';

import { Anchor, Avatar, Caption, Headline2, Link, StateTag } from '../atoms';
import ExternalLink from './ExternalLink';
import LinkHeadline from './LinkHeadline';
import PillList from './PillList';
import TagList from './TagList';
import { formatDate } from '../date';
import { rem } from '../pixels';
import {
  alumniBadgeIcon,
  DiscoveryProjectIcon,
  ResourceProjectIcon,
  TeamIcon,
  TraineeProjectIcon,
} from '../icons';

const TEAM_ICON = <TeamIcon />;

export type ProjectOutputType = 'discovery' | 'resource' | 'trainee';

const PROJECT_ICONS: Record<ProjectOutputType, React.ReactElement> = {
  discovery: <DiscoveryProjectIcon />,
  resource: <ResourceProjectIcon />,
  trainee: <TraineeProjectIcon />,
};

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
  projects?: ReadonlyArray<{
    id: string;
    title: string;
    projectType: ProjectOutputType;
    href?: string;
  }>;
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

const externalLinkWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  height: rem(32),
  '& > div': {
    height: '100%',
  },
  '& a': {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  '& a > span': {
    height: '100%',
    boxSizing: 'border-box',
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

const counterBaseStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: rem(8),
});

const associationCounterStyles = css(counterBaseStyles, {
  marginLeft: rem(32),
});

const counterAvatarStyles = css({
  width: rem(24),
  flex: 'none',
  '& > p': {
    margin: 0,
  },
});

const titleStyles = css({
  display: 'flex',
  columnGap: rem(15),
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: rem(4),
  marginBottom: rem(4),
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

const authorRowStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: rem(40),
  rowGap: rem(8),
});

const authorItemStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  columnGap: rem(8),
  '& > div:first-of-type': {
    width: rem(24),
    height: rem(24),
    flex: 'none',
    margin: 0,
    '& > p': {
      margin: 0,
    },
  },
});

type AuthorRowProps = {
  authors: ProjectOutput['authors'];
  max: number;
};

const AuthorRow: React.FC<AuthorRowProps> = ({ authors, max }) => {
  const visible = authors.slice(0, max);
  const remaining = authors.length - visible.length;
  return (
    <div css={authorRowStyles}>
      {visible.map((author, index) => {
        const isInternal = 'firstName' in author;
        return (
          <span key={isInternal ? author.id : `ext-${index}`} css={authorItemStyles}>
            <Avatar
              firstName={isInternal ? author.firstName : undefined}
              lastName={isInternal ? author.lastName : undefined}
              imageUrl={isInternal ? author.avatarUrl : undefined}
            />
            {isInternal ? (
              <Link href={network({}).users({}).user({ userId: author.id }).$}>
                {author.displayName}
              </Link>
            ) : (
              author.displayName
            )}
            {isInternal && author.alumniSinceDate && (
              <span css={{ display: 'inline-flex' }}>{alumniBadgeIcon}</span>
            )}
          </span>
        );
      })}
      {remaining > 0 && (
        <span css={counterBaseStyles}>
          <span css={counterAvatarStyles}>
            <Avatar placeholder={`+${remaining}`} />
          </span>
          <span>Authors</span>
        </span>
      )}
    </div>
  );
};

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
        <span css={associationCounterStyles}>
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
}) => {
  const primaryProject = projects?.[0];

  return (
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
          <div css={externalLinkWrapperStyles}>
            <ExternalLink
              href={link}
              label="Access Output"
              size="large"
              noMargin
            />
          </div>
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
            <Headline2 styleAsHeading={5} noMargin>{title}</Headline2>
          </Anchor>
        )}
        {!published && (
          <StateTag
            label={isInReview ? 'In Review' : 'Draft'}
            accent={isInReview ? 'blue' : undefined}
          />
        )}
      </div>
      <AuthorRow authors={authors} max={3} />
      <div css={associationStyles}>
        {primaryProject && (
          <AssociationRow
            icon={PROJECT_ICONS[primaryProject.projectType]}
            max={1}
            label="Projects"
            items={(projects ?? []).map(({ id, title: displayName, href }) => ({
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
        <div css={tagContainerStyles}>
          <TagList max={3} tags={keywords} />
        </div>
      )}
      <div css={datesStyles}>
        <Caption accent={'lead'} asParagraph noMargin>
          Date Added: {formatDate(new Date(addedDate || created))}
        </Caption>
        <Caption accent={'lead'} asParagraph noMargin>
          <span css={dateSeparatorStyles}>• </span>
          Last Updated:{' '}
          {formatDate(new Date(lastModifiedDate || addedDate || created))}
        </Caption>
      </div>
    </>
  );
};

export default ProjectOutputBody;

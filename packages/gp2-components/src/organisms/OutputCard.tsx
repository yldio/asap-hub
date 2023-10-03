import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Caption,
  Card,
  formatDate,
  Headline2,
  Link,
  Paragraph,
  pixels,
  SharedResearchMetadata,
  UsersList,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { editIcon, projectIcon, workingGroupIcon } from '../icons';
import { IconWithLabel } from '../molecules';

const { rem } = pixels;

const entitiesStyles = css({
  margin: `${rem(4)} 0 ${rem(32)}`,
  display: 'flex',
  flexDirection: 'column',

  '&.reverse': {
    flexDirection: 'column-reverse',
  },
});

type OutputCardProps = Pick<
  gp2Model.OutputResponse,
  | 'id'
  | 'addedDate'
  | 'title'
  | 'workingGroups'
  | 'projects'
  | 'authors'
  | 'link'
  | 'documentType'
  | 'type'
  | 'subtype'
  | 'mainEntity'
> & {
  isAdministrator?: boolean;
};

const OutputCard: React.FC<OutputCardProps> = ({
  id,
  addedDate,
  title,
  workingGroups,
  projects,
  documentType,
  type,
  subtype,
  authors,
  link,
  isAdministrator,
  mainEntity,
}) => (
  <Card padding={false}>
    <div css={css({ padding: rem(24) })}>
      <div css={css({ display: 'flex', gap: rem(24) })}>
        <SharedResearchMetadata
          pills={
            [
              // mainEntity.type === 'WorkingGroups' ? 'Working Group' : 'Project',
              documentType,
              type,
              subtype,
            ].filter(Boolean) as string[]
          }
          link={link}
        />
        {isAdministrator && (
          <div css={css({ width: 'min-content' })}>
            <Link
              href={gp2Routing.outputs({}).output({ outputId: id }).edit({}).$}
              buttonStyle
              noMargin
              small
              fullWidth
            >
              <span
                css={{
                  display: 'inline-flex',
                  gap: rem(8),
                  marginLeft: rem(6),
                }}
              >
                {'Edit'}
                {editIcon}
              </span>
            </Link>
          </div>
        )}
      </div>
      <div css={css({ margin: `${rem(12)} 0 ${rem(24)}` })}>
        <Headline2 styleAsHeading={4} noMargin>
          {title}
        </Headline2>
      </div>
      <UsersList
        users={authors.map((author) => ({
          ...author,
          href: author.id && gp2Routing.users({}).user({ userId: author.id }).$,
        }))}
        max={3}
      />
      <div
        css={entitiesStyles}
        className={`${mainEntity.type === 'Projects' ? 'reverse' : ''}`}
      >
        {workingGroups && (
          <IconWithLabel icon={workingGroupIcon}>
            {workingGroups.length > 1 ? (
              <Paragraph>{workingGroups.length} Working Groups</Paragraph>
            ) : (
              <Link
                href={
                  gp2Routing.workingGroups({}).workingGroup({
                    workingGroupId: workingGroups[0]?.id as string,
                  }).$
                }
              >
                {workingGroups[0]?.title}
              </Link>
            )}
          </IconWithLabel>
        )}
        {projects && (
          <IconWithLabel icon={projectIcon}>
            {projects.length > 1 ? (
              <Paragraph>{projects.length} Projects</Paragraph>
            ) : (
              <Link
                href={
                  gp2Routing
                    .projects({})
                    .project({ projectId: projects[0]?.id as string }).$
                }
              >
                {projects[0]?.title}
              </Link>
            )}
          </IconWithLabel>
        )}
      </div>
      <Caption noMargin accent={'lead'} asParagraph>
        Date Added: {formatDate(new Date(addedDate))}
      </Caption>
    </div>
  </Card>
);

export default OutputCard;

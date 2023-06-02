import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Caption,
  Card,
  formatDate,
  Headline2,
  Link,
  pixels,
  SharedResearchMetadata,
  UsersList,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { editIcon, projectIcon, workingGroupIcon } from '../icons';
import { IconWithLabel } from '../molecules';

const { rem } = pixels;

type OutputCardProps = Pick<
  gp2Model.OutputResponse,
  | 'id'
  | 'addedDate'
  | 'title'
  | 'workingGroup'
  | 'project'
  | 'authors'
  | 'link'
  | 'documentType'
  | 'type'
  | 'subtype'
> & {
  isAdministrator?: boolean;
};

const OutputCard: React.FC<OutputCardProps> = ({
  id,
  addedDate,
  title,
  workingGroup,
  project,
  documentType,
  type,
  subtype,
  authors,
  link,
  isAdministrator,
}) => (
  <Card padding={false}>
    <div css={css({ padding: rem(24) })}>
      <div css={css({ display: 'flex', gap: rem(24) })}>
        <SharedResearchMetadata
          pills={
            [
              workingGroup && 'Working Group',
              project && 'Project',
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
      <div css={css({ margin: `${rem(4)} 0 ${rem(32)}` })}>
        {workingGroup && (
          <IconWithLabel noMargin icon={workingGroupIcon}>
            <Link
              href={
                gp2Routing
                  .workingGroups({})
                  .workingGroup({ workingGroupId: workingGroup.id }).$
              }
            >
              {workingGroup.title}
            </Link>
          </IconWithLabel>
        )}
        {project && (
          <IconWithLabel noMargin icon={projectIcon}>
            <Link
              href={
                gp2Routing.projects({}).project({ projectId: project.id }).$
              }
            >
              {project.title}
            </Link>
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

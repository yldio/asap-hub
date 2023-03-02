import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
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
import { css } from '@emotion/react';

import { IconWithLabel } from '../molecules';
import { projectIcon, workingGroupIcon } from '../icons';

const { rem } = pixels;

type OutputCardProps = Pick<
  gp2Model.OutputResponse,
  | 'addedDate'
  | 'title'
  | 'workingGroups'
  | 'projects'
  | 'authors'
  | 'link'
  | 'documentType'
  | 'type'
  | 'subtype'
>;

const OutputCard: React.FC<OutputCardProps> = ({
  addedDate,
  title,
  workingGroups,
  projects,
  documentType,
  type,
  subtype,
  authors,
  link,
}) => (
  <Card padding={false}>
    <div css={css({ padding: rem(24) })}>
      <SharedResearchMetadata
        pills={
          [
            workingGroups && 'Working Group',
            projects && 'Project',
            documentType,
            type,
            subtype,
          ].filter(Boolean) as string[]
        }
        link={link}
      />

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
        {workingGroups && (
          <IconWithLabel noMargin icon={workingGroupIcon}>
            <Link
              href={
                gp2Routing
                  .workingGroups({})
                  .workingGroup({ workingGroupId: workingGroups.id }).$
              }
            >
              {workingGroups.title}
            </Link>
          </IconWithLabel>
        )}
        {projects && (
          <IconWithLabel noMargin icon={projectIcon}>
            <Link
              href={
                gp2Routing.projects({}).project({ projectId: projects.id }).$
              }
            >
              {projects.title}
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

import { gp2 } from '@asap-hub/model';
import { Link, Subtitle } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { nonMobileQuery } from '../layout';
import { CollapsibleTable, EditableCard, StatusPill } from '../molecules';

type UserProjectsProps = Pick<gp2.UserResponse, 'firstName' | 'projects'> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'> & {
    noLinks?: boolean;
  };

const tableStyles = css({
  [nonMobileQuery]: {
    gridTemplateColumns: '3fr 1fr',
  },
});

const UserProjects: React.FC<UserProjectsProps> = ({
  projects,
  firstName,
  subtitle,
  noLinks = false,
}) => (
  <EditableCard
    title="Projects"
    subtitle={
      subtitle ||
      `${firstName} has been involved in the following GP2 projects:`
    }
  >
    {projects.length ? (
      <CollapsibleTable headings={['Name', 'Status']} tableStyles={tableStyles}>
        {projects.map((project) => {
          const name = noLinks ? (
            project.title
          ) : (
            <Link
              underlined
              href={
                gp2Routing.projects({}).project({
                  projectId: project.id,
                }).$
              }
            >
              {project.title}
            </Link>
          );

          const status = <StatusPill status={project.status} />;

          return {
            id: project.id,
            values: [name, status],
          };
        })}
      </CollapsibleTable>
    ) : (
      <Subtitle accent={'lead'}>
        You are not associated to any projects.
      </Subtitle>
    )}
  </EditableCard>
);

export default UserProjects;

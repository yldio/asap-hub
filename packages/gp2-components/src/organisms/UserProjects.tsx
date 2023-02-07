import { gp2 } from '@asap-hub/model';
import { Link } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { CollapsibleTable, EditableCard, StatusPill } from '../molecules';

type UserProjectsProps = Pick<
  gp2.UserResponse,
  'id' | 'firstName' | 'projects'
> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'> & {
    noLinks?: boolean;
  };

const getUserProjectRole = (
  userId: gp2.UserResponse['id'],
  project: gp2.UserResponse['projects'][number],
): gp2.ProjectMemberRole | null =>
  project.members.find((member) => member.userId === userId)?.role || null;

const UserProjects: React.FC<UserProjectsProps> = ({
  projects,
  firstName,
  id,
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
    <CollapsibleTable headings={['Name', 'Role', 'Status']}>
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
        const role = getUserProjectRole(id, project) || '';
        const status = <StatusPill status={project.status} />;

        return {
          id: project.id,
          values: [name, role, status],
        };
      })}
    </CollapsibleTable>
  </EditableCard>
);

export default UserProjects;

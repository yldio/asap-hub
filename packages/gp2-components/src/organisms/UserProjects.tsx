import { gp2 } from '@asap-hub/model';
import { Link } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { StatusPill, TableDisplay } from '../molecules';

type UserProjectsProps = Pick<
  gp2.UserResponse,
  'id' | 'firstName' | 'projects'
>;

const getUserProjectRole = (
  userId: gp2.UserResponse['id'],
  project: gp2.UserResponse['projects'][number],
): gp2.ProjectMemberRole | null =>
  project.members.find((member) => member.userId === userId)?.role || null;

const UserProjects: React.FC<UserProjectsProps> = ({
  projects,
  firstName,
  id,
}) => (
  <TableDisplay
    paragraph={`${firstName} has been involved in the following GP2 projects:`}
    headings={['Name', 'Role', 'Status']}
  >
    {projects.map((project) => {
      const name = (
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
        id,
        values: [name, role, status],
      };
    })}
  </TableDisplay>
);

export default UserProjects;

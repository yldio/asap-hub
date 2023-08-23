import { gp2 } from '@asap-hub/model';
import { Link, Subtitle } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { EditableCard, StatusPill } from '../molecules';
import { CardTable } from '.';

type UserProjectsProps = Pick<
  gp2.UserResponse,
  'id' | 'firstName' | 'projects'
> &
  Pick<ComponentProps<typeof EditableCard>, 'subtitle'> & {
    noLinks?: boolean;
    isOnboarding?: boolean;
  };

const UserProjects: React.FC<UserProjectsProps> = ({
  projects,
  firstName,
  id,
  subtitle,
  noLinks = false,
  isOnboarding = false,
}) => {
  const getUserProject = (
    userId: gp2.UserResponse['id'],
    project: gp2.UserResponse['projects'][number],
  ): gp2.UserResponse['projects'][number]['members'] =>
    project.members.filter((member) => member.userId === userId);

  return (
    <EditableCard
      title="Projects"
      subtitle={
        subtitle ||
        `${firstName} has been involved in the following GP2 projects:`
      }
    >
      {projects.length ? (
        <CardTable
          isOnboarding={isOnboarding}
          headings={
            isOnboarding ? ['Name', 'Status'] : ['Name', 'Role', 'Status']
          }
        >
          {projects
            .filter(
              (proj, idx) =>
                idx === projects.findIndex((p) => p.id === proj.id),
            )
            .flatMap((project) => {
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
              const userMembership = getUserProject(id, project);

              const status = <StatusPill status={project.status} />;

              if (userMembership.length === 0) {
                return {
                  id: project.id,
                  values: isOnboarding ? [name, status] : [name, '', status],
                };
              }

              return userMembership.map(({ role }) => ({
                id: project.id,
                values: isOnboarding ? [name, status] : [name, role, status],
              }));
            })}
        </CardTable>
      ) : (
        <Subtitle accent={'lead'}>
          You are not associated to any projects.
        </Subtitle>
      )}
    </EditableCard>
  );
};

export default UserProjects;

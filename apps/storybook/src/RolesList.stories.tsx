import { RolesList } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Roles List',
  component: RolesList,
};

export const SingleRole = () => (
  <RolesList roles={['Lead PI (Core Leadership)']} />
);

export const TwoRoles = () => (
  <RolesList roles={['Lead PI (Core Leadership)', 'Project Manager']} />
);

export const ThreeRolesWithOverflow = () => (
  <RolesList
    roles={['Lead PI (Core Leadership)', 'Project Manager', 'Collaborating PI']}
  />
);

export const FourRolesWithOverflow = () => (
  <RolesList
    roles={[
      'Lead PI (Core Leadership)',
      'Project Manager',
      'Collaborating PI',
      'Co-PI (Core Leadership)',
    ]}
  />
);

export const CustomMaxVisible = () => (
  <RolesList
    roles={[
      'Lead PI (Core Leadership)',
      'Project Manager',
      'Collaborating PI',
      'Co-PI (Core Leadership)',
    ]}
    maxVisible={3}
  />
);

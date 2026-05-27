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

export const InlineSingleRole = () => (
  <RolesList roles={['Lead PI (Core Leadership)']} inline />
);

export const InlineTwoRoles = () => (
  <RolesList roles={['Lead PI (Core Leadership)', 'Project Manager']} inline />
);

export const InlineThreeRolesWithOverflow = () => (
  <RolesList
    roles={['Lead PI (Core Leadership)', 'Project Manager', 'Collaborating PI']}
    inline
  />
);

import Pill from './Pill';

type SpeakerRoleBadgeProps = {
  readonly roles: string[];
};

const displayRole = ([role, ...rest]: string[]): string => {
  if (role === undefined) {
    return 'No role';
  }
  if (rest.length > 0) {
    return 'Multiple roles';
  }
  return role;
};

const SpeakerRoleBadge: React.FC<SpeakerRoleBadgeProps> = ({ roles }) => (
  <Pill accent="gray" noMargin>
    {displayRole(roles)}
  </Pill>
);

export default SpeakerRoleBadge;

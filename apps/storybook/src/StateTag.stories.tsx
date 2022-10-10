import {
  alumniBadge,
  inactiveBadgeIcon,
  StateTag,
} from '@asap-hub/react-components';

export default {
  title: 'Atoms / StateTag',
};

export const Alumni = () => <StateTag icon={alumniBadge} label="Alumni" />;

export const Inactive = () => (
  <StateTag icon={inactiveBadgeIcon} label="Inactive" />
);

import {
  alumniBadgeIcon,
  InactiveBadgeIcon,
  StateTag,
} from '@asap-hub/react-components';

export default {
  title: 'Atoms / StateTag',
};

export const Alumni = () => <StateTag icon={alumniBadgeIcon} label="Alumni" />;

export const Inactive = () => (
  <StateTag icon={<InactiveBadgeIcon />} label="Inactive" />
);

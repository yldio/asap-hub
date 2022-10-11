import { TabButton } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Navigation / Tab Button',
};

export const Active = () => <TabButton active={true}>Button</TabButton>;

export const Inactive = () => <TabButton active={false}>Button</TabButton>;

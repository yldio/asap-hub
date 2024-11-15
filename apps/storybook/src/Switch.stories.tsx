import { Switch, SwitchProps } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Switch',
  component: Switch,
};

export const Default = (props: SwitchProps) => <Switch {...props} />;

export const Checked = (props: SwitchProps) => (
  <Switch {...props} checked={true} />
);

export const Disabled = (props: SwitchProps) => (
  <Switch {...props} enabled={false} />
);

export const CheckedAndDisabled = (props: SwitchProps) => (
  <Switch {...props} checked={true} enabled={false} />
);

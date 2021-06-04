import { PillList } from '@asap-hub/react-components';
import { array } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Pill List',
};

export const Normal = () => (
  <PillList pills={array('Pills', ['Proposal', '3D Printing'])} />
);

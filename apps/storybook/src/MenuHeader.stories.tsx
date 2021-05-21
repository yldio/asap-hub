import { MenuHeader } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Layout / Menu Header',
  component: MenuHeader,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <MenuHeader />;

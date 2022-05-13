import { NavigationHeader } from '@asap-hub/gp2-components';

import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Layout / NavigationHeader',
  component: NavigationHeader,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <NavigationHeader></NavigationHeader>;

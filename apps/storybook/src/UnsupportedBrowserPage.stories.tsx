import { UnsupportedBrowserPage } from '@asap-hub/react-components';

import { BasicLayoutDecorator } from './layout';

export default {
  title: 'Templates / Unsupported Browser Page',
  component: UnsupportedBrowserPage,
  decorators: [BasicLayoutDecorator],
};

export const Normal = () => <UnsupportedBrowserPage />;

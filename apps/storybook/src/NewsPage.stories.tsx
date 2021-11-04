import { NewsPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / News / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => <NewsPage>Page Content</NewsPage>;

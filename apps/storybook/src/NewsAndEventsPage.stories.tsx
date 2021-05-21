import { NewsAndEventsPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / News / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => <NewsAndEventsPage>Page Content</NewsAndEventsPage>;

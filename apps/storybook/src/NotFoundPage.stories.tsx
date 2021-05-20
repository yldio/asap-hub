import { NotFoundPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Not Found Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => <NotFoundPage />;

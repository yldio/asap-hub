import { LoadingLayout } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / Loading Layout',
  component: LoadingLayout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <LoadingLayout />;

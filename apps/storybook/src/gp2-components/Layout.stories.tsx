import { Layout } from '@asap-hub/gp2-components';

import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Layout / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Layout>
    <div>Content</div>
  </Layout>
);

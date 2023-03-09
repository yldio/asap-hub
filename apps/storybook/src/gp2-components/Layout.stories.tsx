import { Layout } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

const props: Omit<ComponentProps<typeof Layout>, 'children'> = {
  menuShown: false,
  projects: [],
  userId: '1',
  workingGroups: [],
};
export const Normal = () => (
  <Layout {...props}>
    <div>Content</div>
  </Layout>
);

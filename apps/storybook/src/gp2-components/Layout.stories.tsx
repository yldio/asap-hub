import { Layout } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';

import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

const props: Pick<
  ComponentProps<typeof Layout>,
  'projects' | 'userId' | 'workingGroups'
> = {
  projects: [],
  userId: '1',
  workingGroups: [],
};
export const Normal = () => (
  <Layout {...props}>
    <div>Content</div>
  </Layout>
);

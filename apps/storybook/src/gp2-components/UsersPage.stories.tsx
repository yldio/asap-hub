import { Layout, UsersPage } from '@asap-hub/gp2-components';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Users Directory / UsersPage',
  component: UsersPage,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Layout>
    <UsersPage>Page content</UsersPage>
  </Layout>
);

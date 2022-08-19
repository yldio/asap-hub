import { Layout, WorkingGroupDetailPage } from '@asap-hub/gp2-components';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates /WorkingGroupDetailPage / WorkingGroupDetailPage',
  component: WorkingGroupDetailPage,
  decorators: [NoPaddingDecorator],
};

const props = {
  id: '',
  title: 'Underrepresented Populations',
  members: [],
  shortDescription: '',
  projects: [],
};

export const Normal = () => (
  <Layout>
    <WorkingGroupDetailPage {...props}></WorkingGroupDetailPage>
  </Layout>
);

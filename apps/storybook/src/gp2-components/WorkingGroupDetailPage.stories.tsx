import { Layout, WorkingGroupDetailPage } from '@asap-hub/gp2-components';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Working Groups / Detail Page',
  component: WorkingGroupDetailPage,
  decorators: [NoPaddingDecorator],
};

const props = {
  id: '',
  title: 'Underrepresented Populations',
  members: [],
  shortDescription: '',
  projects: [],
  backHref: '',
  isWorkingGroupMember: false,
};

export const Normal = () => (
  <Layout>
    <WorkingGroupDetailPage {...props}></WorkingGroupDetailPage>
  </Layout>
);

export const WithResources = () => (
  <Layout>
    <WorkingGroupDetailPage {...props} isWorkingGroupMember={true} />
  </Layout>
);

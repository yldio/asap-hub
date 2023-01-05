import { Layout, WorkingGroupDetailPage } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';
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

const layoutProps: Pick<
  ComponentProps<typeof Layout>,
  'projects' | 'workingGroups'
> = {
  projects: [],
  workingGroups: [],
};
export const Normal = () => (
  <Layout {...layoutProps}>
    <WorkingGroupDetailPage {...props}></WorkingGroupDetailPage>
  </Layout>
);

export const WithResources = () => (
  <Layout {...layoutProps}>
    <WorkingGroupDetailPage {...props} isWorkingGroupMember={true} />
  </Layout>
);

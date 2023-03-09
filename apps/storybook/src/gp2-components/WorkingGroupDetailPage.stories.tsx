import { Layout, WorkingGroupDetailPage } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';
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
  isAdministrator: boolean('is admin', false),
};

const layoutProps: Pick<
  ComponentProps<typeof Layout>,
  'projects' | 'userId' | 'workingGroups' | 'menuShown'
> = {
  projects: [],
  userId: '1',
  workingGroups: [],
  menuShown: false,
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

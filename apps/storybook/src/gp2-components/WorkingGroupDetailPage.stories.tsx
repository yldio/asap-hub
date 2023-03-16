import { Layout, WorkingGroupDetailPage } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Working Groups / Detail Page',
  component: WorkingGroupDetailPage,
  decorators: [NoPaddingDecorator],
};

const props: ComponentProps<typeof WorkingGroupDetailPage> = {
  id: '',
  title: 'Underrepresented Populations',
  members: [],
  projects: [],
  isWorkingGroupMember: false,
  isAdministrator: boolean('is admin', false),
  outputsTotal: 1,
  upcomingTotal: 2,
  pastTotal: 4,
};

const layoutProps: Omit<ComponentProps<typeof Layout>, 'children'> = {
  projects: [],
  userId: '1',
  workingGroups: [],
};
export const Normal = () => (
  <Layout {...layoutProps}>
    <WorkingGroupDetailPage {...props} />
  </Layout>
);

export const WithResources = () => (
  <Layout {...layoutProps}>
    <WorkingGroupDetailPage {...props} isWorkingGroupMember={true} />
  </Layout>
);

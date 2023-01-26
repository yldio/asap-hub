import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { FilterPills } from '@asap-hub/gp2-components';
import { noop } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / Filter Pills',
  component: FilterPills,
};

const props: ComponentProps<typeof FilterPills> = {
  filters: {
    keywords: [],
    regions: ['Asia', 'Africa'],
    projects: [],
    workingGroups: [],
  } as ComponentProps<typeof FilterPills>['filters'],
  projects: gp2Fixtures.createProjectsResponse().items.map(({ id, title }) => ({
    id,
    title,
  })),
  workingGroups: gp2Fixtures
    .createWorkingGroupsResponse()
    .items.map(({ id, title }) => ({
      id,
      title,
    })),
  onRemove: noop,
};

export const Normal = () => <FilterPills {...props} />;

import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import {
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
import {
  createWorkingGroupMembers,
  createDeliverables,
  createWorkingGroupLeaders,
} from '@asap-hub/fixtures';
import { boolean, select, number, text } from '@storybook/addon-knobs';
import { network } from '@asap-hub/routing';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Working Group / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = select('Active Tab', { about: 'about' }, 'about');
  const routes = {
    about: network({})
      .workingGroups({})
      .workingGroup({ workingGroupId: 'id' })
      .about({}).$,
  };

  const props: ComponentProps<typeof WorkingGroupPage> &
    ComponentProps<typeof WorkingGroupAbout> = {
    id: 'id',
    pointOfContact: undefined,
    title: text('Working Group name', 'Working group name'),
    description: text('Description', 'A description about the working group.'),
    deliverables: createDeliverables(number('Deliverables', 4)),
    members: createWorkingGroupMembers(number('Number of members', 6)),
    leaders: createWorkingGroupLeaders(number('Number of leaders', 6)),
    complete: boolean('Complete', false),
    externalLink: text('External link', 'link//'),
    lastModifiedDate: new Date(
      text('Last updated', '2022-01-01'),
    ).toISOString(),
  };

  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <WorkingGroupPage {...props}>
        <WorkingGroupAbout {...props} />
      </WorkingGroupPage>
    </StaticRouter>
  );
};

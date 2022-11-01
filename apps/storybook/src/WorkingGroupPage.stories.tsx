import { StaticRouter } from 'react-router-dom';
import { WorkingGroupPage } from '@asap-hub/react-components';
import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { boolean, select, number, text } from '@storybook/addon-knobs';
import { network } from '@asap-hub/routing';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Working Group / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => {
  const activeTab = select(
    'Active Tab',
    { Users: 'users', Teams: 'teams', Groups: 'groups' },
    'users',
  );
  const routes = {
    users: network({}).users({}).$,
    teams: network({}).teams({}).$,
    groups: network({}).groups({}).$,
  };
  const props = {
    pointOfContact: boolean('Point Of Contact', true)
      ? {
          id: '2',
          displayName: 'Peter Venkman',
          firstName: 'Peter',
          lastName: 'Venkman',
          email: 'peter@ven.com',
          role: 'Project Manager',
        }
      : undefined,
    name: text('Working Group name', 'Working group name'),
    members: createTeamResponseMembers({
      teamMembers: number('Number of members', 6),
    }),
    complete: boolean('Complete', false),
    description: text('Description', 'Some description'),
    externalLink: text('External link', 'link//'),
    externalLinkText: text('External link text', 'Working Group Folder'),
    lastUpdated: new Date(text('Last updated', '2022-01-01')).toISOString(),
  };

  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <WorkingGroupPage {...props}>Page Content</WorkingGroupPage>
    </StaticRouter>
  );
};

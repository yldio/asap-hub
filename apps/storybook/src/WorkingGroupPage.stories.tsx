import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import {
  WorkingGroupAbout,
  WorkingGroupPage,
} from '@asap-hub/react-components';
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
  const props: ComponentProps<typeof WorkingGroupPage> = {
    id: 'id',
    pointOfContact: {
      id: '2',
      displayName: 'Peter Venkman',
      firstName: 'Peter',
      lastName: 'Venkman',
      email: 'peter@ven.com',
      role: 'Project Manager',
    },
    name: text('Working Group name', 'Working group name'),
    members: createTeamResponseMembers({
      teamMembers: number('Number of members', 6),
    }),
    complete: boolean('Complete', false),
    description: text(
      'Description',
      '<Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl nisi scelerisque eu ultrices vitae. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis. Tellus orci ac auctor augue. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan. Risus feugiat in ante metus dictum at tempor. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla. Aliquet nibh praesent tristique magna sit amet. Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc. Pretium nibh ipsum consequat nisl. Arcu cursus euismod quis viverra nibh cras pulvinar. Faucibus scelerisque eleifend donec pretium vulputate sapien. Mollis aliquam ut porttitor leo. Nulla porttitor massa id neque aliquam vestibulum. Egestas erat imperdiet sed euismod nisi porta lorem. Consequat interdum varius sit amet mattis.>',
    ),
    externalLink: text('External link', 'link//'),
    externalLinkText: text('External link text', 'Working Group Folder'),
    lastUpdated: new Date(text('Last updated', '2022-01-01')).toISOString(),
  };

  return (
    <StaticRouter key={activeTab} location={routes[activeTab]}>
      <WorkingGroupPage {...props}>
        <WorkingGroupAbout
          members={props.members}
          description={props.description}
          pointOfContact={props.pointOfContact}
        />
      </WorkingGroupPage>
    </StaticRouter>
  );
};

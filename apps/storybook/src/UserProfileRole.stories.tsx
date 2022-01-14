import { ComponentProps } from 'react';
import { number, select, text } from '@storybook/addon-knobs';
import { UserProfileRole } from '@asap-hub/react-components';
import { createLabs, createListTeamResponse } from '@asap-hub/fixtures';

import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / User Profile / Role',
  decorators: [UserProfileDecorator],
};

const props = (): ComponentProps<typeof UserProfileRole> => {
  const numberOfTeams = number('Number of teams', 1);
  const numberOfLabs = number('Number of labs', 1);
  return {
    firstName: text('First Name', 'Daniel'),
    teams: createListTeamResponse(numberOfTeams).items.map(
      ({ id, displayName }) => ({ id, displayName, role: 'Key Personnel' }),
    ),
    researchInterests: text('Research Interests', 'My research Interests'),
    responsibilities: text('Responsibilities', 'My responsibilities'),
    reachOut: text('Reach Out', 'You need help setting up your profile'),
    labs: createLabs({ labs: numberOfLabs }),
    role: select('ASAP Hub Role', ['Staff', 'Grantee', 'Guest'], 'Grantee'),
  };
};

export const Normal = () => <UserProfileRole {...props()} />;

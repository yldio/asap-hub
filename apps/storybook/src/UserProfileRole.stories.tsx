import { number, text } from '@storybook/addon-knobs';
import { UserProfileRole } from '@asap-hub/react-components';

import { UserProfileDecorator } from './user-profile';
import { ComponentProps } from 'react';
import { createLabs, createListTeamResponse } from '@asap-hub/fixtures';

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
    labs: createLabs({ labs: numberOfLabs }),
  };
};

export const Normal = () => <UserProfileRole {...props()} />;

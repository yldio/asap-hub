import { MembersList } from '@asap-hub/react-components';
import { createListUserResponse } from '@asap-hub/fixtures';

import { number, boolean, text } from './knobs';

export default {
  title: 'Molecules / Members List',
  component: MembersList,
};

export const Normal = () => (
  <MembersList
    singleColumn={boolean('Force Single Column', false)}
    members={createListUserResponse(number('Number of members', 6)).items.map(
      (member, index) => ({
        ...member,
        alumniSinceDate: index === 2 ? '2021-01-01' : undefined,
        firstLine: text('First Line', `${member.firstName} ${member.lastName}`),
        secondLine: text('Second Line', 'Second Line'),
        thirdLine: text('Third Line', 'Third Line'),
      }),
    )}
  />
);

export const WithTeam = () => (
  <MembersList
    singleColumn={boolean('Force Single Column', false)}
    members={createListUserResponse(number('Number of members', 6)).items.map(
      (member) => ({
        ...member,
        firstLine: text('First Line', `${member.firstName} ${member.lastName}`),
        secondLine: text('Second Line', 'Second Line'),
        thirdLine: Array(number('Number of teams', 2))
          .fill(null)
          .map((_, i) => ({
            id: `${i}`,
            displayName: `${text('Team Name', 'Example')} ${i + 1}`,
          })),
      }),
    )}
  />
);

import { MembersList, RolesList, LabsList } from '@asap-hub/react-components';
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

export const WithRolesList = () => (
  <MembersList
    singleColumn={false}
    members={[
      {
        id: '1',
        firstLine: 'Dana Lopez',
        firstName: 'Dana',
        lastName: 'Lopez',
        secondLine: (
          <RolesList roles={['Lead PI (Core Leadership)', 'Project Manager']} />
        ),
      },
      {
        id: '2',
        firstLine: 'Alex Chen',
        firstName: 'Alex',
        lastName: 'Chen',
        secondLine: (
          <RolesList
            roles={[
              'Collaborating PI',
              'Co-PI (Core Leadership)',
              'ASAP Staff',
            ]}
            maxVisible={2}
          />
        ),
      },
      {
        id: '3',
        firstLine: 'Taylor Mills',
        firstName: 'Taylor',
        lastName: 'Mills',
        secondLine: <RolesList roles={['Key Personnel']} />,
      },
    ]}
  />
);

export const WithLabsList = () => (
  <MembersList
    singleColumn={false}
    members={[
      {
        id: '1',
        firstLine: 'Dana Lopez',
        firstName: 'Dana',
        lastName: 'Lopez',
        secondLine: 'Lead PI (Core Leadership)',
        thirdLine: (
          <LabsList
            labs={[
              { id: 'lab-1', name: 'Bhatt' },
              { id: 'lab-2', name: 'Anderson' },
              { id: 'lab-3', name: 'Smith' },
            ]}
            maxVisible={2}
          />
        ),
      },
      {
        id: '2',
        firstLine: 'Alex Chen',
        firstName: 'Alex',
        lastName: 'Chen',
        secondLine: 'Collaborating PI',
        thirdLine: (
          <LabsList labs={[{ id: 'lab-1', name: 'Olsen' }]} maxVisible={2} />
        ),
      },
    ]}
  />
);

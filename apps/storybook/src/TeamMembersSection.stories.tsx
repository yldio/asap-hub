import { TeamMembersSection } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Organisms / Team Profile / Members',
};

export const Normal = () => (
  <TeamMembersSection
    title={'Team Members (7)'}
    members={[
      {
        id: '1',
        firstLine: 'Daniel Ramirez',
        firstName: 'Daniel',
        lastName: 'Ramirez',
        secondLine: 'Lead PI (Core Leadership)',
      },
      {
        id: '2',
        firstLine: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        secondLine: 'Project Manager',
        avatarUrl: text(
          'Member 2 Avatar URL',
          'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
        ),
      },
      {
        id: '3',
        firstLine: 'Tess W. B. Goetz',
        firstName: 'Tess',
        lastName: 'Goetz',
        secondLine: 'Collaborating PI',
      },
      {
        id: '4',
        firstLine: 'Robin Peploe',
        firstName: 'Robin',
        lastName: 'Peploe',
        secondLine: 'Collaborating PI',
      },
      {
        id: '5',
        firstLine: 'Alice Lane',
        firstName: 'Alice',
        lastName: 'Lane',
        secondLine: 'Collaborating PI',
      },
      {
        id: '6',
        firstLine: 'Philip Mars',
        firstName: 'Philip',
        lastName: 'Mars',
        secondLine: 'Collaborating PI',
      },
      {
        id: '7',
        firstLine: 'Emmanuel Depay',
        firstName: 'Emanuel',
        lastName: 'Depay',
        secondLine: 'Collaborating PI',
      },
    ]}
  />
);

export const Empty = () => <TeamMembersSection members={[]} />;

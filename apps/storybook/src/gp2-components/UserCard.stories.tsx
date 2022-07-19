import { UserCard } from '@asap-hub/gp2-components';
import { text, date, select } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / User Directory / User Card',
};

export const Normal = () => {
  const degree = select(
    'Degree',
    ['Empty', 'BA', 'BSc', 'MSc', 'PhD', 'MD', 'MD, PhD', 'MPH', 'MA', 'MBA'],
    'PhD',
  );
  return (
    <UserCard
      id="u42"
      displayName={text('Display Name', 'Phillip Mars')}
      createdDate={new Date(
        date('Created Date', new Date(2020, 6, 12, 14, 32)),
      ).toISOString()}
      degree={[degree]}
      firstName={text('First Name', 'Phillip')}
      lastName={text('Last Name', 'Mars')}
      avatarUrl={text('Avatar URL', '')}
      role={'GP2 Admin'}
      region={'Latin America'}
      workingGroups={[
        { id: '1', name: 'Training, Networking and Communication' },
        { id: '2', name: 'Steering Committee' },
        { id: '3', name: 'Underrepresented Populations' },
      ]}
      projects={[
        { id: '1', name: 'Training, Networking and Communication' },
        { id: '2', name: 'Steering Committee' },
        { id: '3', name: 'Underrepresented Populations' },
      ]}
      tags={[
        'Genetics',
        'Neurology',
        'Operations',
        'Training',
        'stuff',
        'more stuff',
      ]}
    />
  );
};

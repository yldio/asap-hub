import { UserCard } from '@asap-hub/gp2-components';
import { text, select, array, number } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / User Directory / User Card',
};

export const Normal = () => {
  const degree = array('Degree', ['PhD', 'MBA']);
  const tags = array('Tags', [
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
    'Neurologic Examination',
    'Neuroprotection',
    'Movement Disorders',
    'Neurodegenerative Diseases',
    'Neurological Diseases',
  ]);
  const region = select(
    'Region',
    [
      'Africa',
      'Asia',
      'Australasia',
      'Europe',
      'North America',
      'Latin America',
      'South America',
    ],
    'Africa',
  );
  return (
    <UserCard
      id="u42"
      displayName={text('Display Name', 'Phillip Mars')}
      degree={degree}
      firstName={text('First Name', 'Phillip')}
      lastName={text('Last Name', 'Mars')}
      avatarUrl={text('Avatar URL', '')}
      role={'GP2 Admin'}
      region={region}
      workingGroups={Array(number('Number of Working Groups', 1)).fill({
        id: 't42',
        name: text('Working Group Name', 'Underrepresented Populations'),
      })}
      projects={Array(number('Number of Projects', 1)).fill({
        id: 't42',
        name: text('Project Name', 'Genetic determinants of progression in PD'),
      })}
      tags={tags}
    />
  );
};

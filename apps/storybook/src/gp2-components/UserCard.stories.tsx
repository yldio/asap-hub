import { Theme, UserCard } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { array, number, select, text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / User Directory / User Card',
};

export const Normal = () => {
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
      'Europe',
      'North America',
      'Latin America',
      'South America',
    ],
    'Africa',
  );
  return (
    <Theme>
      <UserCard
        id="u42"
        displayName={text('Display Name', 'Phillip Mars')}
        degrees={gp2.userDegrees.map((d) => d)}
        firstName={text('First Name', 'Phillip')}
        lastName={text('Last Name', 'Mars')}
        avatarUrl={text('Avatar URL', '')}
        role={'Administrator'}
        region={region}
        workingGroups={Array(number('Number of Working Groups', 1))
          .fill({
            name: text('Working Group Name', 'Underrepresented Populations'),
          })
          .map(({ name }, index) => ({ id: index.toString(), name }))}
        projects={Array(number('Number of Projects', 1))
          .fill({
            name: text(
              'Project Name',
              'Genetic determinants of progression in PD',
            ),
          })
          .map(({ name }, index) => ({ id: index.toString(), name }))}
        tags={tags}
      />
    </Theme>
  );
};

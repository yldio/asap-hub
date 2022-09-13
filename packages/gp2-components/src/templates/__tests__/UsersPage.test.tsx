import { render, screen } from '@testing-library/react';
import UsersPage from '../UsersPage';

const users = [
  {
    id: 'u42',
    displayName: 'John Doe',
    degree: ['PhD'],
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: '',
    role: 'GP2 Admin',
    region: 'Europe',
    workingGroups: [{ id: 0, name: 'Underrepresented Populations' }],
    projects: [{ id: 0, name: 'Genetic determinants of progression in PD' }],
    tags: [
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
      'Neuroimaging',
      'Neurologic Examination',
      'Neuroprotection',
      'Movement Disorders',
      'Neurodegenerative Diseases',
      'Neurological Diseases',
    ],
  },
];

describe('UsersPage', () => {
  it('renders a banner', () => {
    render(<UsersPage users={users} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});

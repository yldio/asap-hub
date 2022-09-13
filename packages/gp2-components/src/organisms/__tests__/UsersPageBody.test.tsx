import { render, screen } from '@testing-library/react';
import UsersPageBody from '../UsersPageBody';

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
  {
    id: 'u59',
    displayName: 'Sam Smyth',
    degree: ['PhD'],
    firstName: 'Sam',
    lastName: 'Smyth',
    avatarUrl: '',
    role: 'GP2 Admin',
    region: 'Africa',
    workingGroups: [{ id: 0, name: 'Underrepresented Populations' }],
    projects: [{ id: 0, name: 'Genetic determinants of progression in PD' }],
    tags: [
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
      'Neuroimaging',
      'Neurologic Examination',
    ],
  },
];

describe('UsersPageBody', () => {
  it('renders a user', () => {
    render(<UsersPageBody users={[users[0]]} />);
    expect(
      screen.getByRole('heading', { name: /John Doe, PhD/i }),
    ).toBeVisible();
  });

  it('renders multiple users', () => {
    render(<UsersPageBody users={users} />);
    expect(
      screen.getByRole('heading', { name: /John Doe, PhD/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Sam Smyth, PhD/i }),
    ).toBeVisible();
  });
});

import { PageControls } from '@asap-hub/react-components';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UsersPage from '../UsersPage';

const props = {
  users: {
    items: [
      {
        id: 'u42',
        displayName: 'John Doe',
        createdDate: '',
        email: 'some@email',
        degree: ['PhD'],
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: '',
        role: 'Administrator' as const,
        region: 'Europe' as const,
        workingGroups: [{ id: 0, name: 'Underrepresented Populations' }],
        projects: [
          { id: 0, name: 'Genetic determinants of progression in PD' },
        ],
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
    ],
    total: 1,
  },
};
const pageProps: ComponentProps<typeof PageControls> = {
  currentPageIndex: 1,
  numberOfPages: 10,
  renderPageHref: (page) => `some-page`,
};

describe('UsersPage', () => {
  it('renders a banner', () => {
    render(<UsersPage {...props} {...pageProps} />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});

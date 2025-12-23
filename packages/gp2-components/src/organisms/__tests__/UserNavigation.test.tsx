import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import UserNavigation from '../UserNavigation';

describe('UserNavigation', () => {
  const props: ComponentProps<typeof UserNavigation> = {
    userId: '1',
    projects: [],
    workingGroups: [],
  };

  it('opens user menu when clicked', async () => {
    render(
      <MemoryRouter>
        <UserNavigation {...props} />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByLabelText(/toggle.+user menu/i));

    expect(screen.getByText(/Log Out/i, { selector: 'p' })).toBeVisible();
  });
});

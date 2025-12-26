import { ComponentProps } from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Layout from '../Layout';

const props: ComponentProps<typeof Layout> = {
  children: 'Content',
  userOnboarded: true,
  userProfileHref: '/profile',
  teams: [],
  workingGroups: [],
  interestGroups: [],
  aboutHref: '/about',
};

it('renders an ASAP logo', async () => {
  // Suppress console.error for known React Router v6 migration issue with isActive prop
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const { getByTitle } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(getByTitle('ASAP Logo')).toBeInTheDocument();
  });

  consoleError.mockRestore();
});

it('renders the main navigation', async () => {
  const { getAllByText } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  expect(getAllByText(/network/i, { selector: 'nav *' })).not.toHaveLength(0);
});

it('renders the user navigation', async () => {
  const { getAllByText } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  expect(getAllByText(/profile/i, { selector: 'nav *' })).not.toHaveLength(0);
});

it('renders the content', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <Layout {...props}>Content</Layout>
    </MemoryRouter>,
  );
  expect(getByText('Content')).toBeVisible();
});

it('renders a menu button that toggles the drawer', async () => {
  const { getByLabelText, queryByTitle } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  expect(queryByTitle(/close/i)).not.toBeInTheDocument();

  await userEvent.click(getByLabelText(/toggle menu/i));
  expect(queryByTitle(/close/i)).toBeInTheDocument();

  await userEvent.click(getByLabelText(/toggle menu/i));
  expect(queryByTitle(/close/i)).not.toBeInTheDocument();
});

it('renders a user menu button that toggles the drawer', async () => {
  const { getByLabelText } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  expect(getByLabelText(/close/i)).not.toBeVisible();

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(getByLabelText(/close/i)).toBeVisible();

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('closes the drawer when clicking the overlay', async () => {
  const { getByLabelText } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  await userEvent.click(getByLabelText(/toggle menu/i));

  await userEvent.click(getByLabelText(/close/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('closes the drawer on navigation', async () => {
  const { getByLabelText, getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <Layout {...props} />
    </MemoryRouter>,
  );
  await userEvent.click(getByLabelText(/toggle menu/i));
  await waitFor(() => {
    expect(getByLabelText(/close/i)).toBeVisible();
  });

  await userEvent.click(getAllByText(/network/i, { selector: 'nav *' })[0]!);
  await waitFor(() => {
    expect(getByLabelText(/close/i)).not.toBeVisible();
  });
});

it('scrolls to top between page navigations', async () => {
  const { getByRole, getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <Layout {...props} />
    </MemoryRouter>,
  );

  await userEvent.click(getAllByText(/network/i, { selector: 'nav *' })[0]!);
  expect(getByRole('main').scrollTo).toHaveBeenCalled();
});

it('displays onboarding footer', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <Layout
        {...props}
        onboardModalHref={'/example'}
        onboardable={{
          incompleteSteps: [{ label: 'Details', modalHref: '/' }],
          totalSteps: 5,
          isOnboardable: false,
        }}
      />
    </MemoryRouter>,
  );
  expect(getByText(/profile.+% complete/i)).toBeVisible();
});

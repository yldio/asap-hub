import { ComponentProps } from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { useScrollToTop } from '@asap-hub/react-context';

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

it('renders CRN logo', async () => {
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
    expect(getByTitle('CRN Logo')).toBeInTheDocument();
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

it('renders a user menu button that toggles the user menu', async () => {
  const { getByLabelText, queryByTitle } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );
  expect(queryByTitle('Chevron Up')).not.toBeInTheDocument();

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(queryByTitle('Chevron Up')).toBeInTheDocument();

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(queryByTitle('Chevron Up')).not.toBeInTheDocument();
});

it('closes the user menu when clicking outside of it', async () => {
  const { getByLabelText, getByText, getByTestId, queryByTitle } = render(
    <MemoryRouter>
      <Layout {...props}>Content</Layout>
    </MemoryRouter>,
  );

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(queryByTitle('Chevron Up')).toBeInTheDocument();

  await userEvent.click(getByText('Content'));
  expect(queryByTitle('Chevron Up')).not.toBeInTheDocument();

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(queryByTitle('Chevron Up')).toBeInTheDocument();

  await userEvent.click(getByTestId('menu-header-testid'));
  expect(queryByTitle('Chevron Up')).not.toBeInTheDocument();
});

it('closes the user menu when pressing Escape', async () => {
  const { getByLabelText, queryByTitle } = render(
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>,
  );

  await userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(queryByTitle('Chevron Up')).toBeInTheDocument();

  await userEvent.keyboard('{Escape}');
  expect(queryByTitle('Chevron Up')).not.toBeInTheDocument();
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

it('calls scrollToTop with merged options', async () => {
  const TestComponent = () => {
    const { scrollToTop } = useScrollToTop();

    return (
      <button onClick={() => scrollToTop({ behavior: 'auto' })}>Scroll</button>
    );
  };
  const scrollToMock = jest.fn();

  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value: scrollToMock,
    writable: true,
  });

  const { getByRole } = render(
    <MemoryRouter>
      <Layout {...props}>
        <TestComponent />
      </Layout>
    </MemoryRouter>,
  );

  await userEvent.click(getByRole('button', { name: /scroll/i }));

  expect(scrollToMock).toHaveBeenCalledWith({
    top: 0,
    behavior: 'auto', // overridden from default 'smooth'
  });
});

describe('the collapsible menu', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // The toggle only renders at desktop widths (display:none below), so under
  // jsdom (no media queries) role queries must opt in to hidden elements.
  it('toggles between Collapse Menu and Expand Menu', async () => {
    const { getByRole, queryByRole, findByRole } = render(
      <MemoryRouter>
        <Layout {...props} />
      </MemoryRouter>,
    );
    // MainNavigation is lazy-loaded behind Suspense; wait for the toggle rather
    // than assuming it mounted synchronously (which races on CI).
    expect(
      await findByRole('button', { name: 'Collapse Menu', hidden: true }),
    ).toBeInTheDocument();

    await userEvent.click(
      getByRole('button', { name: 'Collapse Menu', hidden: true }),
    );
    expect(
      getByRole('button', { name: 'Expand Menu', hidden: true }),
    ).toBeInTheDocument();
    expect(
      queryByRole('button', { name: 'Collapse Menu', hidden: true }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      getByRole('button', { name: 'Expand Menu', hidden: true }),
    );
    expect(
      getByRole('button', { name: 'Collapse Menu', hidden: true }),
    ).toBeInTheDocument();
  });

  it('persists the collapsed state across mounts', async () => {
    const { findByRole, unmount } = render(
      <MemoryRouter>
        <Layout {...props} />
      </MemoryRouter>,
    );
    await userEvent.click(
      await findByRole('button', { name: 'Collapse Menu', hidden: true }),
    );
    unmount();

    const { findByRole: findByRoleRemounted } = render(
      <MemoryRouter>
        <Layout {...props} />
      </MemoryRouter>,
    );
    expect(
      await findByRoleRemounted('button', {
        name: 'Expand Menu',
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  it('hides nav labels while expanding, then reveals them', async () => {
    const { container, findByRole } = render(
      <MemoryRouter>
        <Layout {...props} />
      </MemoryRouter>,
    );
    // Count only the nav-item tooltips (the toggle keeps its own tooltip in the
    // DOM in every state, so scope to the list). Their presence is the
    // structural signal that labels are hidden (icon-only layout).
    const navTooltips = () =>
      container.querySelectorAll('nav ul [role="tooltip"]');
    // MainNavigation is lazy-loaded behind Suspense, so wait for the toggle to
    // mount rather than assuming it is there synchronously (that assumption is
    // what made this test race on slower/CI machines).
    const collapse = await findByRole('button', {
      name: 'Collapse Menu',
      hidden: true,
    });
    await userEvent.click(collapse); // collapse is immediate
    await userEvent.click(
      await findByRole('button', { name: 'Expand Menu', hidden: true }),
    );
    // Mid-expand: labels are still hidden, so items keep their tooltip spans.
    expect(navTooltips().length).toBeGreaterThan(0);
    // Once the reveal timer fires the labels come back and the tooltip spans go.
    await waitFor(() => expect(navTooltips()).toHaveLength(0));
  });
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

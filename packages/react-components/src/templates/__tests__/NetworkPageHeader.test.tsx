import { ComponentProps } from 'react';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { network } from '@asap-hub/routing';

import NetworkPageHeader from '../NetworkPageHeader';

const props: ComponentProps<typeof NetworkPageHeader> = {
  page: 'teams',

  searchQuery: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('alters the search placeholder based on the tab', () => {
  const { getByRole, rerender } = render(
    <MemoryRouter initialEntries={[network({}).teams({}).$]}>
      <NetworkPageHeader {...props} page="teams" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

  rerender(
    <MemoryRouter initialEntries={[network({}).users({}).$]}>
      <NetworkPageHeader {...props} page="users" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);

  rerender(
    <MemoryRouter initialEntries={[network({}).interestGroups({}).$]}>
      <NetworkPageHeader {...props} page="interest-groups" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter an interest group, keyword, …"`);

  rerender(
    <MemoryRouter initialEntries={[network({}).workingGroups({}).$]}>
      <NetworkPageHeader {...props} page="working-groups" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, …"`);
});

it('shows the filter in all the tabs (teams, groups, working-groups and users)', () => {
  const { getByText, queryByText, rerender } = render(
    <MemoryRouter initialEntries={[network({}).teams({}).$]}>
      <NetworkPageHeader {...props} page="teams" />
    </MemoryRouter>,
  );
  expect(queryByText(/filters/i)).toBeInTheDocument();

  rerender(
    <MemoryRouter initialEntries={[network({}).interestGroups({}).$]}>
      <NetworkPageHeader {...props} page="interest-groups" />
    </MemoryRouter>,
  );
  expect(getByText(/filters/i)).toBeInTheDocument();

  rerender(
    <MemoryRouter initialEntries={[network({}).workingGroups({}).$]}>
      <NetworkPageHeader {...props} page="working-groups" />
    </MemoryRouter>,
  );
  expect(getByText(/filters/i)).toBeInTheDocument();

  rerender(
    <MemoryRouter initialEntries={[network({}).users({}).$]}>
      <NetworkPageHeader {...props} page="users" />
    </MemoryRouter>,
  );
  expect(getByText(/filters/i)).toBeInTheDocument();
});

it('highlights the current tab', () => {
  const { getByText, rerender } = render(
    <StaticRouter key="teams" location={network({}).teams({}).$}>
      <NetworkPageHeader {...props} page="teams" />
    </StaticRouter>,
  );
  expect(
    findParentWithStyle(
      getByText(/teams/i, { selector: 'nav a *' }),
      'fontWeight',
    )!.fontWeight,
  ).toBe('bold');
  expect(
    findParentWithStyle(
      getByText(/people/i, { selector: 'nav a *' }),
      'fontWeight',
    )?.fontWeight,
  ).not.toBe('bold');

  rerender(
    <StaticRouter key="users" location={network({}).users({}).$}>
      <NetworkPageHeader {...props} page="users" />
    </StaticRouter>,
  );
  expect(
    findParentWithStyle(
      getByText(/teams/i, { selector: 'nav a *' }),
      'fontWeight',
    )?.fontWeight,
  ).not.toBe('bold');
  expect(
    findParentWithStyle(
      getByText(/people/i, { selector: 'nav a *' }),
      'fontWeight',
    )!.fontWeight,
  ).toBe('bold');
});

it('renders tab links preserving the search query', async () => {
  const { getByText } = render(
    <NetworkPageHeader {...props} searchQuery="searchterm" />,
  );
  expect(
    new URL(
      getByText('Interest Groups', { selector: 'nav a *' }).closest('a')!.href,
    ),
  ).toMatchObject({
    pathname: expect.stringMatching(/interest-groups$/),
    searchParams: new URLSearchParams({ searchQuery: 'searchterm' }),
  });
});

it('renders a search box with the search query', () => {
  const { getByRole } = render(
    <NetworkPageHeader {...props} searchQuery={'test123'} />,
  );
  expect((getByRole('searchbox') as HTMLInputElement).value).toEqual('test123');
});

it('does not render the search box based on props', () => {
  const { queryByRole } = render(
    <NetworkPageHeader {...props} showSearch={false} />,
  );
  expect(queryByRole('searchbox')).not.toBeInTheDocument();
});

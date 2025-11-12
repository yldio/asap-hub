import { ComponentProps } from 'react';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { network } from '@asap-hub/routing';

import NetworkPageHeader from '../NetworkPageHeader';

const mockIsEnabled = jest.fn();

jest.mock('@asap-hub/react-context', () => ({
  useFlags: () => ({ isEnabled: mockIsEnabled }),
}));

beforeEach(() => {
  mockIsEnabled.mockReturnValue(true);
  jest.spyOn(console, 'error').mockImplementation();
});

const props: ComponentProps<typeof NetworkPageHeader> = {
  page: 'discovery-teams',

  searchQuery: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('alters the search placeholder based on the tab', () => {
  const { getByRole, rerender } = render(
    <MemoryRouter initialEntries={[network({}).discoveryTeams({}).$]}>
      <NetworkPageHeader {...props} page="discovery-teams" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

  rerender(
    <MemoryRouter initialEntries={[network({}).resourceTeams({}).$]}>
      <NetworkPageHeader {...props} page="resource-teams" />
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

it('shows the filter in all the tabs (discovery-teams, resource-teams, groups, working-groups and users)', () => {
  const { getByText, queryByText, rerender } = render(
    <MemoryRouter initialEntries={[network({}).discoveryTeams({}).$]}>
      <NetworkPageHeader {...props} page="discovery-teams" />
    </MemoryRouter>,
  );
  expect(queryByText(/filters/i)).toBeInTheDocument();

  rerender(
    <MemoryRouter initialEntries={[network({}).resourceTeams({}).$]}>
      <NetworkPageHeader {...props} page="resource-teams" />
    </MemoryRouter>,
  );
  expect(getByText(/filters/i)).toBeInTheDocument();

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
    <StaticRouter
      key="discovery-teams"
      location={network({}).discoveryTeams({}).$}
    >
      <NetworkPageHeader {...props} page="discovery-teams" />
    </StaticRouter>,
  );
  expect(
    findParentWithStyle(
      getByText(/discovery teams/i, { selector: 'nav a *' }),
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
    <StaticRouter
      key="resource-teams"
      location={network({}).resourceTeams({}).$}
    >
      <NetworkPageHeader {...props} page="resource-teams" />
    </StaticRouter>,
  );
  expect(
    findParentWithStyle(
      getByText(/resource teams/i, { selector: 'nav a *' }),
      'fontWeight',
    )!.fontWeight,
  ).toBe('bold');
  expect(
    findParentWithStyle(
      getByText(/discovery teams/i, { selector: 'nav a *' }),
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
      getByText(/discovery teams/i, { selector: 'nav a *' }),
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

it('throws error for invalid page type', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation();

  expect(() => {
    render(
      <NetworkPageHeader
        {...props}
        page={'invalid-page' as unknown as 'resource-teams'}
      />,
    );
  }).toThrow('Invalid page');

  spy.mockRestore();
});

it('renders page description when provided', () => {
  const { getByText } = render(
    <NetworkPageHeader
      {...props}
      pageDescription={<p>This is a custom page description</p>}
    />,
  );
  expect(getByText('This is a custom page description')).toBeInTheDocument();
});

it('does not render page description when not provided', () => {
  const { queryByText } = render(<NetworkPageHeader {...props} />);
  // Should not find any custom description text
  expect(queryByText(/custom page description/i)).not.toBeInTheDocument();
});

describe('Data Manager filter', () => {
  it('removes the Data Manager filter when the flag is disabled', () => {
    mockIsEnabled.mockReturnValueOnce(false);
    const { queryByText } = render(
      <MemoryRouter initialEntries={[network({}).users({}).$]}>
        <NetworkPageHeader {...props} page="users" />
      </MemoryRouter>,
    );
    expect(queryByText('Data Manager')).not.toBeInTheDocument();
  });

  it('shows the Data Manager filter when the flag is enabled', () => {
    mockIsEnabled.mockReturnValueOnce(true);
    const { getByText } = render(
      <MemoryRouter initialEntries={[network({}).users({}).$]}>
        <NetworkPageHeader {...props} page="users" />
      </MemoryRouter>,
    );
    expect(getByText('Data Manager')).toBeInTheDocument();
  });
});

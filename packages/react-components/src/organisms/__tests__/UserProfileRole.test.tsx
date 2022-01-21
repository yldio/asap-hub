import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import UserProfileRole from '../UserProfileRole';

const defaultProps = {
  firstName: 'Phillip',
  labs: [],
  teams: [],
  researchInterests: 'These are my research interest',
  responsibilities: 'these are my responsibilities',
  role: 'Grantee' as const,
};

it('generates a heading', () => {
  const { getByRole } = render(<UserProfileRole {...defaultProps} />);

  expect(getByRole('heading', { level: 2 }).textContent).toMatchInlineSnapshot(
    `"Phillip's Role on ASAP Network"`,
  );
});

it('renders a link to team page', () => {
  const { getByRole } = render(
    <UserProfileRole
      {...defaultProps}
      teams={[
        {
          id: '42',
          displayName: 'Team',
          role: 'Lead PI (Core Leadership)',
        },
      ]}
    />,
  );
  expect(getByRole('link')).toHaveAttribute('href', '/network/teams/42');
});

it('renders responsibilities if present', () => {
  const { rerender, queryByText, queryAllByText } = render(
    <UserProfileRole {...defaultProps} responsibilities={undefined} />,
  );
  expect(queryByText(/responsibilities/i)).not.toBeInTheDocument();

  rerender(
    <UserProfileRole
      {...defaultProps}
      responsibilities="my defined responsibilities"
    />,
  );

  expect(queryAllByText(/responsibilities/i).length).toBeGreaterThan(0);
});

it('renders placeholder if no responsibilities provided for your own profile', () => {
  const { rerender, queryByText, queryAllByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileRole {...defaultProps} responsibilities={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/responsibilities/i)).not.toBeInTheDocument();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileRole {...defaultProps} responsibilities={undefined} />,
    </UserProfileContext.Provider>,
  );

  expect(queryAllByText(/responsibilities/i).length).toBeGreaterThan(0);
});

it('renders the list of labs', () => {
  const { queryByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileRole
        {...defaultProps}
        labs={[
          { name: 'LONDON', id: '0001' },
          { name: 'Paris', id: '0002' },
          { name: 'barcelona', id: '0003' },
        ]}
      />
    </UserProfileContext.Provider>,
  );

  expect(queryByText(/labs/i)).toBeVisible();
  expect(queryByText('LONDON Lab, Paris Lab and barcelona Lab')).toBeVisible();
});

describe('When the role is not Staff', () => {
  it('renders researchInterests if present', () => {
    const { rerender, queryByText, queryAllByText } = render(
      <UserProfileRole
        {...defaultProps}
        researchInterests={undefined}
        role="Grantee"
      />,
    );

    expect(queryByText(/interests/i)).not.toBeInTheDocument();

    rerender(
      <UserProfileRole
        {...defaultProps}
        researchInterests="my defined research interests"
        role="Grantee"
      />,
    );

    expect(queryAllByText(/interests/i).length).toBeGreaterThan(0);
  });
  it('renders placeholder for your own profile when there is no researchInterests', () => {
    const { rerender, queryByText, queryAllByText } = render(
      <UserProfileContext.Provider value={{ isOwnProfile: false }}>
        <UserProfileRole
          {...defaultProps}
          researchInterests={undefined}
          role="Grantee"
        />
      </UserProfileContext.Provider>,
    );
    expect(queryByText(/interests/i)).not.toBeInTheDocument();
    rerender(
      <UserProfileContext.Provider value={{ isOwnProfile: true }}>
        <UserProfileRole
          {...defaultProps}
          researchInterests={undefined}
          role="Grantee"
        />
      </UserProfileContext.Provider>,
    );
    expect(queryAllByText(/interests/i).length).toBeGreaterThan(0);
  });
  it('doesnt render reach out section', () => {
    const { queryByText } = render(
      <UserProfileRole
        {...defaultProps}
        reachOut="Reach out to me for"
        role="Grantee"
      />,
    );
    expect(queryByText(/reach out to me for/i)).not.toBeInTheDocument();
  });
});

describe('When role is Staff', () => {
  it('doesnt render researchInterests', () => {
    const { queryByText } = render(
      <UserProfileRole
        {...defaultProps}
        researchInterests="my defined research interests"
        role="Staff"
      />,
    );

    expect(
      queryByText(/my defined research interests/i),
    ).not.toBeInTheDocument();
  });
  it('renders reachOut if present', () => {
    const { rerender, queryByText, queryAllByText } = render(
      <UserProfileRole {...defaultProps} reachOut={undefined} role="Staff" />,
    );

    expect(queryByText(/reach out to me for/i)).not.toBeInTheDocument();

    rerender(
      <UserProfileRole
        {...defaultProps}
        reachOut="Reach out to me for"
        role="Staff"
      />,
    );

    expect(queryAllByText(/reach out to me for/i).length).toBeGreaterThan(0);
  });
  it('renders placeholder for your own profile when there is no reachOut', () => {
    const { rerender, queryByText, queryAllByText } = render(
      <UserProfileContext.Provider value={{ isOwnProfile: false }}>
        <UserProfileRole {...defaultProps} reachOut={undefined} role="Staff" />
      </UserProfileContext.Provider>,
    );
    expect(
      queryByText(
        /This will help the Hub to direct grantees to the right point of contact/i,
      ),
    ).not.toBeInTheDocument();
    rerender(
      <UserProfileContext.Provider value={{ isOwnProfile: true }}>
        <UserProfileRole {...defaultProps} reachOut={undefined} role="Staff" />
      </UserProfileContext.Provider>,
    );
    expect(
      queryAllByText(
        /This will help the Hub to direct grantees to the right point of contact/i,
      ).length,
    ).toBeGreaterThan(0);
  });
});

import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import UserProfileBackground from '../UserProfileBackground';

it('generates a heading', () => {
  const { getByText } = render(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      labs={[]}
    />,
  );
  expect(getByText(/role.on.asap/i).tagName).toBe('H2');
});

it('renders links to team page twice', () => {
  const { getAllByRole } = render(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      labs={[]}
    />,
  );

  const links = (getAllByRole('link') as HTMLAnchorElement[]).map(
    ({ href }) => href,
  );
  expect(links).toMatchInlineSnapshot(`
    Array [
      "http://localhost/network/teams/42",
      "http://localhost/network/teams/42",
    ]
  `);
});

it('renders proposal if present', () => {
  const { rerender, queryAllByText } = render(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      labs={[]}
    />,
  );

  expect(queryAllByText(/proposal/i)).toHaveLength(0);

  rerender(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      approach="text"
      proposal="42"
      labs={[]}
    />,
  );

  expect(queryAllByText(/proposal/i).length).toBeGreaterThan(0);
});

it('renders responsibilities if present', () => {
  const { rerender, queryAllByText } = render(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      labs={[]}
    />,
  );
  expect(queryAllByText(/responsibilities/i)).toHaveLength(0);

  rerender(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      responsibilities="text"
      labs={[]}
    />,
  );

  expect(queryAllByText(/responsibilities/i).length).toBeGreaterThan(0);
});

it('renders placeholder if no responsibilities provided for your own profile', () => {
  const { rerender, queryAllByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileBackground
        id="42"
        firstName="Phillip"
        displayName="Phillip, M"
        role="Collaborating PI"
        labs={[]}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(queryAllByText(/responsibilities/i)).toHaveLength(0);

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileBackground
        id="42"
        firstName="Phillip"
        displayName="Phillip, M"
        role="Collaborating PI"
        labs={[]}
      />
      ,
    </UserProfileContext.Provider>,
  );

  expect(queryAllByText(/responsibilities/i).length).toBeGreaterThan(0);
});

it('renders approach if present', () => {
  const { rerender, queryAllByText } = render(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      labs={[]}
    />,
  );

  expect(queryAllByText(/interests/i)).toHaveLength(0);

  rerender(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      approach="text"
      labs={[]}
    />,
  );

  expect(queryAllByText(/interests/i).length).toBeGreaterThan(0);
});

it('renders placeholder for your own profile when there is no approach', () => {
  const { rerender, queryAllByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileBackground
        id="42"
        firstName="Phillip"
        displayName="Phillip, M"
        role="Collaborating PI"
        labs={[]}
      />
    </UserProfileContext.Provider>,
  );
  expect(queryAllByText(/interests/i)).toHaveLength(0);

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileBackground
        id="42"
        firstName="Phillip"
        displayName="Phillip, M"
        role="Collaborating PI"
        labs={[]}
      />
    </UserProfileContext.Provider>,
  );

  expect(queryAllByText(/interests/i).length).toBeGreaterThan(0);
});

it('renders the list of labs', () => {
  const { queryByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileBackground
        id="42"
        firstName="Phillip"
        displayName="Phillip, M"
        role="Collaborating PI"
        labs={[
          { name: 'LONDON', id: '0001' },
          { name: 'Paris', id: '0002' },
          { name: 'barcelona', id: '0003' },
        ]}
      />
    </UserProfileContext.Provider>,
  );

  expect(queryByText(/labs/i)).toBeVisible();
  expect(queryByText('London Lab, Paris Lab, and Barcelona Lab')).toBeVisible();
});

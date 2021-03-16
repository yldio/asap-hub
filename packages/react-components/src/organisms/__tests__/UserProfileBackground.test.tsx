import React from 'react';
import { render } from '@testing-library/react';

import UserProfileBackground from '../UserProfileBackground';

it('generates a heading', () => {
  const { getByText } = render(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
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
    />,
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
    />,
  );

  expect(queryAllByText(/approach/i)).toHaveLength(0);

  rerender(
    <UserProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborating PI"
      approach="text"
    />,
  );

  expect(queryAllByText(/interests/i).length).toBeGreaterThan(0);
});

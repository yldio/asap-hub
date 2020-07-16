import React from 'react';
import { render, waitFor, RenderResult } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';

import Profile from '../Profile';
import { API_BASE_URL } from '../../../config';

// fetch user by code request
beforeEach(() => {
  nock(API_BASE_URL).get('/users/42').reply(200, {});
});

afterEach(async () => {
  await waitFor(() => nock.isDone());
});

// storage
afterEach(() => {
  window.sessionStorage.clear();
});

// redirect
const originalLocation = globalThis.location;
let assign: jest.MockedFunction<typeof globalThis.location.assign>;

beforeEach(() => {
  assign = jest.fn();
  delete globalThis.location;
  globalThis.location = { ...originalLocation, assign };
});

afterEach(() => {
  globalThis.location = originalLocation;
});

const renderProfile = async (): Promise<RenderResult> => {
  return render(
    <MemoryRouter initialEntries={['/42/']}>
      <Route exact path="/:id/" component={Profile} />
    </MemoryRouter>,
  );
};

it('renders a loading indicator', async () => {
  const { getByText } = await renderProfile();
  expect(getByText(/loading/i).textContent).toMatchInlineSnapshot(`"Loading"`);
});

it('renders a member information', async () => {
  const user = {
    department: 'Unknown Department',
    displayName: 'John Doe',
    institution: 'Unknown Institution',
    lastModified: new Date(2020, 6, 12, 14, 32),
    location: 'Unknown Location',
    role: 'Unknown Role',
    team: 'Unknown Team',
    title: 'Unknown Title',
  };

  nock.cleanAll();
  nock(API_BASE_URL).get('/users/42').reply(200, user);

  const { findByRole } = await renderProfile();
  expect((await findByRole('heading')).textContent).toEqual(user.displayName);
  expect(nock.isDone()).toBeTruthy();
});

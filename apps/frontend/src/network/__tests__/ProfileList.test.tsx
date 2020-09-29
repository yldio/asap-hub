import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { ListUserResponse } from '@asap-hub/model';
import { authTestUtils } from '@asap-hub/react-components';

import Profiles from '../ProfileList';
import { API_BASE_URL } from '../../config';

const users: ListUserResponse = {
  total: 2,
  items: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      createdDate: '2020-09-07T17:36:54Z',
      lastModifiedDate: '2020-09-07T17:36:54Z',
      displayName: 'Person A',
      email: 'agnete.kirkeby@sund.ku.dk',
      firstName: 'Agnete',
      middleName: '',
      lastName: 'Kirkeby',
      jobTitle: 'Assistant Professor',
      institution: 'University of Copenhagen',
      teams: [
        {
          id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
          displayName: 'Jakobsson, J',
          role: 'Core Leadership - Co-Investigator',
        },
      ],
      orcid: '0000-0001-8203-6901',
      orcidWorks: [],
      skills: [],
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb7',
      createdDate: '2020-09-07T17:36:54Z',
      lastModifiedDate: '2020-09-07T17:36:54Z',
      displayName: 'Person B',
      email: 'agnete.kirkeby@sund.ku.dk',
      firstName: 'Agnete',
      middleName: '',
      lastName: 'Kirkeby',
      jobTitle: 'Assistant Professor',
      institution: 'University of Copenhagen',
      teams: [
        {
          id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
          displayName: 'Jakobsson, J',
          role: 'Core Leadership - Co-Investigator',
        },
      ],
      orcid: '0000-0001-8203-6901',
      orcidWorks: [],
      skills: [],
    },
  ],
};

// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/users')
    .reply(200, users);
});

const renderProfileList = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/users']}>
            <Route path="/users" component={Profiles} />
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders a loading indicator', async () => {
  const { getByText } = await renderProfileList();

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders a list of people', async () => {
  const { container } = await renderProfileList();
  expect(container.textContent).toContain('Person A');
  expect(container.textContent).toContain('Person B');
});

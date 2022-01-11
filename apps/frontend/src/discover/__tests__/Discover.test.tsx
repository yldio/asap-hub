import nock from 'nock';
import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { DiscoverResponse } from '@asap-hub/model';
import { createPageResponse, createUserResponse } from '@asap-hub/fixtures';
import { MemoryRouter, Route } from 'react-router-dom';
import Discover from '../Discover';

import { API_BASE_URL } from '../../config';

const renderDiscover = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={{}}>
          <MemoryRouter initialEntries={['/']}>
            <Route exact path="/" component={Discover} />
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders discover header', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      aboutUs: '',
      members: [],
      pages: [],
      training: [],
      scientificAdvisoryBoard: [],
    });

  const { getByText } = await renderDiscover();
  expect(getByText(/discover/i, { selector: 'h1' })).toBeVisible();
});

it('renders discover with guidance, about and members', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '<h1>About us</h1>',
      pages: [createPageResponse('1'), createPageResponse('2')],
      members: [createUserResponse()],
      scientificAdvisoryBoard: [createUserResponse()],
    } as DiscoverResponse);

  const { queryAllByText, getByText } = await renderDiscover();
  expect(getByText(/about/i, { selector: 'h1' })).toBeVisible();
  expect(queryAllByText(/title/i, { selector: 'h2' }).length).toBe(2);
});

it('renders discover with training', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [
        {
          id: 't1',
          title: 'My Training',
          text: 'This is my training',
          type: 'Training',
          created: '2021-01-01',
        },
      ],
      aboutUs: '<h1>About us</h1>',
      pages: [createPageResponse('1'), createPageResponse('2')],
      members: [],
      scientificAdvisoryBoard: [],
    } as DiscoverResponse);

  const { getByText } = await renderDiscover();
  expect(getByText('My Training').closest('a')!.href).toContain('t1');
});

it('renders discover with members', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '',
      pages: [],
      members: [
        {
          ...createUserResponse(),
          id: 'uuid',
          displayName: 'John Doe',
        },
      ],
      scientificAdvisoryBoard: [],
    } as DiscoverResponse);

  const { getByText } = await renderDiscover();
  expect(getByText('John Doe').closest('a')!.href).toContain('uuid');
});

it('sets the member roles to Staff', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '',
      pages: [],
      members: [{ ...createUserResponse(), role: 'Guest' }],
      scientificAdvisoryBoard: [],
    } as DiscoverResponse);

  const { getByText } = await renderDiscover();
  expect(getByText('Staff')).toBeVisible();
});

it('renders discover with scientific advisory board', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '',
      pages: [],
      members: [],
      scientificAdvisoryBoard: [
        {
          ...createUserResponse(),
          id: 'uuid',
          displayName: 'John Doe',
        },
      ],
    } as DiscoverResponse);

  const { getByText } = await renderDiscover();
  expect(getByText('John Doe').closest('a')!.href).toContain('uuid');
});

it('sets the scientific advisory board roles to Staff', async () => {
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/discover')
    .once()
    .reply(200, {
      training: [],
      aboutUs: '',
      pages: [],
      members: [],
      scientificAdvisoryBoard: [{ ...createUserResponse(), role: 'Guest' }],
    } as DiscoverResponse);

  const { getByText } = await renderDiscover();
  expect(getByText('Staff')).toBeVisible();
});

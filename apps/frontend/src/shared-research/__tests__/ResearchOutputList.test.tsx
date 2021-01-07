import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';

import ResearchOutputList from '../ResearchOutputList';
import { API_BASE_URL } from '../../config';

// fetch user by code request
beforeEach(() => {
  nock.cleanAll();
});

const renderResearchOutputList = async () => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          <MemoryRouter initialEntries={['/shared-research']}>
            <Route path="/shared-research" component={ResearchOutputList} />
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

it('renders a list of research outputs', async () => {
  const researchOutputs = createListResearchOutputResponse(2);
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs')
    .query({ take: 10, skip: 0 })

    .reply(200, {
      ...researchOutputs,
      items: researchOutputs.items.map((item, index) => ({
        ...item,
        title: `Test Output ${index}`,
      })),
    });
  const { container } = await renderResearchOutputList();
  expect(container.textContent).toContain('Test Output 0');
  expect(container.textContent).toContain('Test Output 1');
});

it('correctly generates research output link', async () => {
  const researchOutputs = createListResearchOutputResponse(2);
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs')
    .query({ take: 10, skip: 0 })
    .reply(200, {
      ...researchOutputs,
      items: researchOutputs.items.map((item, index) => ({
        ...item,
        title: `Test Output ${index}`,
        id: `test-output-id-${index}`,
      })),
    });
  const { getByText } = await renderResearchOutputList();
  const link = getByText('Test Output 0').closest('a');
  expect(link?.href).toEqual(
    'http://localhost/shared-research/test-output-id-0',
  );
});

it('correctly generates external research output link', async () => {
  const researchOutputs = createListResearchOutputResponse(2);
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs')
    .query({ take: 10, skip: 0 })
    .reply(200, {
      ...researchOutputs,
      items: researchOutputs.items.map((item, index) => ({
        ...item,
        link: index === 0 ? 'https://example.com' : null,
        title: `Test Output ${index}`,
        id: `test-output-id-${index}`,
      })),
    });
  const { getByTitle } = await renderResearchOutputList();
  const link = getByTitle(/external\slink/i).closest('a');
  expect(link).toHaveAttribute('href', 'https://example.com');
});

it('correctly generates team link', async () => {
  const researchOutputs = createListResearchOutputResponse(2);
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get('/research-outputs')
    .query({ take: 10, skip: 0 })
    .reply(200, {
      ...researchOutputs,
      items: researchOutputs.items.map((item, index) => ({
        ...item,
        team: {
          displayName: `Test Team ${index}`,
          id: `test-team-${index}`,
        },
      })),
    });
  const { getByText } = await renderResearchOutputList();
  const link = getByText('Team Test Team 0').closest('a');
  expect(link?.href).toEqual('http://localhost/network/teams/test-team-0');
});

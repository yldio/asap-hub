import React, { ComponentProps } from 'react';
import { RecoilRoot } from 'recoil';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { StaticRouter, MemoryRouter, Route } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';

import { Auth0Provider } from '@asap-hub/frontend/src/auth/test-utils';
import Research from '../Research';
import { patchUser } from '../api';

jest.mock('../api');
jest.mock('../groups/api');

const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const wrapper: React.FC = ({ children }) => (
  <RecoilRoot>
    <React.Suspense fallback="loading">
      <Auth0Provider user={{ id: '42' }}>
        <StaticRouter>{children}</StaticRouter>
      </Auth0Provider>
    </React.Suspense>
  </RecoilRoot>
);

it('renders the profile research section', async () => {
  const { findByText } = render(
    <Research
      user={{ ...createUserResponse(), skills: ['Some Skill'] }}
      teams={[]}
    />,
    { wrapper },
  );
  expect(await findByText('Some Skill')).toBeVisible();
});

it("does not allow editing somebody else's profile", async () => {
  const { queryByText, queryByLabelText } = render(
    <Auth0Provider user={{ id: '42' }}>
      <Research user={{ ...createUserResponse(), id: '1337' }} teams={[]} />,
    </Auth0Provider>,
    { wrapper },
  );
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', async () => {
  const { findAllByLabelText } = render(
    <Auth0Provider user={{ id: '42' }}>
      <Research user={{ ...createUserResponse(), id: '42' }} teams={[]} />,
    </Auth0Provider>,
    { wrapper },
  );
  expect(await findAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing', () => {
  const user: ComponentProps<typeof Research>['user'] = {
    ...createUserResponse({ teams: 1 }),
    questions: ['question 1', 'question 2', 'question 3', 'question 4'],
    id: '42',
  };

  const teams: ComponentProps<typeof Research>['teams'] = [
    {
      ...user.teams[0],
      id: '1',
      href: '/wrong',
      role: 'Collaborating PI',
      approach: 'My Approach',
      displayName: 'Example Team',
      responsibilities: 'My Responsibilities',
    },
  ];
  let result!: RenderResult;
  beforeEach(async () => {
    result = render(
      <Auth0Provider user={{ id: '42' }}>
        <MemoryRouter initialEntries={['/research']}>
          <Route path="/research">
            <Research user={user} teams={teams} />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );
    await result.findAllByLabelText(/edit/i);
  });
  describe('team membership', () => {
    it('opens and closes the dialog', async () => {
      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(await findByLabelText(/edit.+team/i));
      expect(getByDisplayValue('My Approach')).toBeVisible();

      userEvent.click(getByText(/close/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('My Approach')).not.toBeInTheDocument();
      });
    });

    it('saves the changes from the dialog', async () => {
      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(await findByLabelText(/example.+team/i));
      await userEvent.type(getByDisplayValue('My Approach'), ' 2');
      expect(getByDisplayValue('My Approach 2')).toBeVisible();

      await userEvent.type(getByDisplayValue('My Responsibilities'), ' 2');
      expect(getByDisplayValue('My Responsibilities 2')).toBeVisible();

      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('My Approach 2')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        '42',
        {
          teams: [
            {
              id: '1',
              approach: 'My Approach 2',
              responsibilities: 'My Responsibilities 2',
            },
          ],
        },
        expect.any(String),
      );
    });
  });
  describe('questions', () => {
    it('opens and closes the dialog', async () => {
      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(await findByLabelText(/edit.+questions/i));
      expect(getByDisplayValue('question 1')).toBeVisible();

      userEvent.click(getByText(/close/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('question 1')).not.toBeInTheDocument();
      });
    });

    it('saves the changes from the dialog', async () => {
      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(await findByLabelText(/edit.+questions/i));
      await userEvent.type(getByDisplayValue('question 1'), ' a');
      expect(getByDisplayValue('question 1 a')).toBeVisible();

      await userEvent.type(getByDisplayValue('question 2'), ' b');
      expect(getByDisplayValue('question 2 b')).toBeVisible();

      await userEvent.type(getByDisplayValue('question 3'), ' c');
      expect(getByDisplayValue('question 3 c')).toBeVisible();
      await userEvent.type(getByDisplayValue('question 4'), ' d');
      expect(getByDisplayValue('question 4 d')).toBeVisible();
      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('question 1 a')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        '42',
        {
          questions: [
            'question 1 a',
            'question 2 b',
            'question 3 c',
            'question 4 d',
          ],
        },
        expect.any(String),
      );
    });
  });
});

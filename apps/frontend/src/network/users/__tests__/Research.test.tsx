import React, { ComponentProps } from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { StaticRouter, MemoryRouter, Route } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';
import userEvent from '@testing-library/user-event';

import Research from '../Research';

it('renders the profile research section', () => {
  const { getByText } = render(
    <Research
      onPatchUserProfile={() => {}}
      userProfile={{ ...createUserResponse(), skills: ['Some Skill'] }}
      teams={[]}
    />,
    { wrapper: StaticRouter },
  );
  expect(getByText('Some Skill')).toBeVisible();
});

it("does not allow editing somebody else's profile", () => {
  const { queryByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <Research
        onPatchUserProfile={() => {}}
        userProfile={{ ...createUserResponse(), id: '1337' }}
        teams={[]}
      />
      ,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', () => {
  const { getAllByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <Research
        onPatchUserProfile={() => {}}
        userProfile={{ ...createUserResponse(), id: '42' }}
        teams={[]}
      />
      ,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing', () => {
  const userProfile: ComponentProps<typeof Research>['userProfile'] = {
    ...createUserResponse({ teams: 1 }),
    questions: ['question 1', 'question 2', 'question 3', 'question 4'],
    id: '42',
  };

  const teams: ComponentProps<typeof Research>['teams'] = [
    {
      ...userProfile.teams[0],
      id: '1',
      href: '/wrong',
      role: 'Collaborating PI',
      approach: 'My Approach',
      displayName: 'Example Team',
      responsibilities: 'My Responsibilities',
    },
  ];
  let handlePatchUserProfile: jest.MockedFunction<
    ComponentProps<typeof Research>['onPatchUserProfile']
  >;
  let result!: RenderResult;
  beforeEach(async () => {
    handlePatchUserProfile = jest.fn();
    result = render(
      <authTestUtils.LoggedIn user={{ id: '42' }}>
        <MemoryRouter initialEntries={['/research']}>
          <Route path="/research">
            <Research
              userProfile={userProfile}
              teams={teams}
              onPatchUserProfile={handlePatchUserProfile}
            />
          </Route>
        </MemoryRouter>
      </authTestUtils.LoggedIn>,
    );
  });
  describe('team membership', () => {
    it('opens and closes the dialog', async () => {
      const {
        getByText,
        queryByText,
        getByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(getByLabelText(/example.+team/i));
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
        getByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(getByLabelText(/example.+team/i));
      await userEvent.type(getByDisplayValue('My Approach'), ' 2');
      expect(getByDisplayValue('My Approach 2')).toBeVisible();

      await userEvent.type(getByDisplayValue('My Responsibilities'), ' 2');
      expect(getByDisplayValue('My Responsibilities 2')).toBeVisible();

      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('My Approach 2')).not.toBeInTheDocument();
      });
      expect(handlePatchUserProfile).toHaveBeenCalledWith({
        teams: [
          {
            id: '1',
            approach: 'My Approach 2',
            responsibilities: 'My Responsibilities 2',
          },
        ],
      });
    });
  });
  describe('questions', () => {
    it('opens and closes the dialog', async () => {
      const {
        getByText,
        queryByText,
        getByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(getByLabelText(/edit.+questions/i));
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
        getByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(getByLabelText(/edit.+questions/i));
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
      expect(handlePatchUserProfile).toHaveBeenCalledWith({
        questions: [
          'question 1 a',
          'question 2 b',
          'question 3 c',
          'question 4 d',
        ],
      });
    });
  });
});

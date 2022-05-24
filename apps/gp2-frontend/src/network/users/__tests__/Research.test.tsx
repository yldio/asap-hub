import { ComponentProps, FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createTeamResponse, createUserResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';
import { network } from '@asap-hub/routing';

import { Auth0Provider } from '@asap-hub/gp2-frontend/src/auth/test-utils';
import Research from '../Research';
import { patchUser } from '../api';

jest.mock('../api');
jest.mock('../groups/api');

const suggestedExpertiseAndResources = ['1', '2', '3', '4', '5'];
jest.mock('../expertise-and-resource-suggestions', () => ({
  __esModule: true,
  default: suggestedExpertiseAndResources,
}));
const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const id = '42';
const makeWrapper =
  (userId = id, currentUserId = userId): FC =>
  ({ children }) =>
    (
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{ id: currentUserId }}>
            <MemoryRouter
              initialEntries={[
                network({}).users({}).user({ userId }).research({}).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).users.template +
                  network({}).users({}).user.template +
                  network({}).users({}).user({ userId }).research.template
                }
              >
                {children}
              </Route>
            </MemoryRouter>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>
    );
const wrapper = makeWrapper();

it('renders the profile research section', async () => {
  const { findByText } = render(
    <Research
      user={{
        ...createUserResponse(),
        expertiseAndResourceTags: ['Some Expertise'],
      }}
    />,
    { wrapper },
  );
  expect(await findByText('Some Expertise')).toBeVisible();
});

it("does not allow editing somebody else's profile", async () => {
  const { queryByText, queryByLabelText } = render(
    <Research user={{ ...createUserResponse(), id }} />,
    { wrapper: makeWrapper(id, '1337') },
  );
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', async () => {
  const { findAllByLabelText } = render(
    <Research user={{ ...createUserResponse(), id }} />,
    { wrapper },
  );
  expect(await findAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing', () => {
  const user: ComponentProps<typeof Research>['user'] = {
    ...createUserResponse(),
    questions: ['question 1', 'question 2', 'question 3', 'question 4'],
    id,
    expertiseAndResourceDescription: 'Expertise Description',
    researchInterests: 'My Interests',
    responsibilities: 'My Responsibilities',
    teams: [
      {
        ...createTeamResponse(),
        id: '1',
        role: 'Collaborating PI',
        displayName: 'Example Team',
      },
    ],
  };

  let result!: RenderResult;
  beforeEach(async () => {
    result = render(<Research user={user} />, { wrapper });
    await result.findAllByLabelText(/edit/i);
  });
  describe('team membership', () => {
    it('opens and closes the dialog', async () => {
      const { getByText, queryByText, findByLabelText, getByDisplayValue } =
        result;

      userEvent.click(await findByLabelText(/edit.+role/i));
      expect(getByDisplayValue('My Interests')).toBeVisible();
      expect(getByText(/close/i)).toBeInTheDocument();
      userEvent.click(getByText(/close/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });

    it('saves the changes from the dialog', async () => {
      const { getByText, queryByText, findByLabelText } = result;

      userEvent.click(await findByLabelText(/edit.+role/i));

      userEvent.click(getByText(/save/i));

      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
      });

      expect(mockPatchUser).toHaveBeenCalledWith(
        id,
        {
          researchInterests: 'My Interests',
          responsibilities: 'My Responsibilities',
          reachOut: '',
        },
        expect.any(String),
      );
    });
  });
  describe('expertise and resources', () => {
    it('opens and closes the dialog', async () => {
      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
      } = result;

      userEvent.click(await findByLabelText(/edit.+resources/i));
      expect(getByDisplayValue('Expertise Description')).toBeVisible();

      userEvent.click(getByText(/close/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(
          queryByDisplayValue('Expertise Description'),
        ).not.toBeInTheDocument();
      });
    });

    it('saves the changes from the dialog', async () => {
      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        getByLabelText,
        queryByDisplayValue,
      } = result;

      userEvent.click(await findByLabelText(/edit.+resources/i));
      userEvent.type(getByDisplayValue('Expertise Description'), ' 2');
      expect(getByDisplayValue('Expertise Description 2')).toBeVisible();
      suggestedExpertiseAndResources.forEach((expertise) => {
        userEvent.type(getByLabelText(/tags/i), expertise);
        userEvent.tab();
      });

      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(
          queryByDisplayValue('Expertise Description 2'),
        ).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        id,
        {
          expertiseAndResourceTags: suggestedExpertiseAndResources,
          expertiseAndResourceDescription: 'Expertise Description 2',
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
      userEvent.type(getByDisplayValue('question 1'), ' a');
      expect(getByDisplayValue('question 1 a')).toBeVisible();

      userEvent.type(getByDisplayValue('question 2'), ' b');
      expect(getByDisplayValue('question 2 b')).toBeVisible();

      userEvent.type(getByDisplayValue('question 3'), ' c');
      expect(getByDisplayValue('question 3 c')).toBeVisible();
      userEvent.type(getByDisplayValue('question 4'), ' d');
      expect(getByDisplayValue('question 4 d')).toBeVisible();
      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('question 1 a')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        id,
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

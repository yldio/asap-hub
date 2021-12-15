import { ComponentProps, FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { createTeamResponse, createUserResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';
import { network } from '@asap-hub/routing';
import { renderHook } from '@testing-library/react-hooks';
import { useFlags } from '@asap-hub/react-context';

import { Auth0Provider } from '@asap-hub/frontend/src/auth/test-utils';
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
    teams: [
      {
        ...createTeamResponse(),
        id: '1',
        role: 'Collaborating PI',
        mainResearchInterests: 'My Interests',
        displayName: 'Example Team',
        responsibilities: 'My Responsibilities',
      },
    ],
  };
  describe('role', () => {
    it('opens and closes the dialog', async () => {
      const {
        result: { current },
      } = renderHook(useFlags);

      current.reset();
      const {
        getByText,
        queryByText,
        findByLabelText,
        queryByDisplayValue,
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
      userEvent.click(await findByLabelText(/edit.+role/i));
      expect(getByText('Your Role on ASAP')).toBeVisible();

      userEvent.click(getByText(/close/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(
          queryByDisplayValue('Your Role on ASAP'),
        ).not.toBeInTheDocument();
      });
    });

    it('saves the changes from the dialog', async () => {
      const {
        result: { current },
      } = renderHook(useFlags);

      current.reset();
      const {
        getByText,
        queryByText,
        findByLabelText,
        findAllByLabelText,
        getByDisplayValue,
        getByRole,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
      userEvent.click(await findByLabelText(/edit.+role/i));
      expect(getByText('Your Role on ASAP')).toBeVisible();

      const [interestsInput, responsibilitiesInput] = [
        getByRole('textbox', {
          name: 'Main research interests (Required)',
        }),
        getByRole('textbox', {
          name: 'Your responsibilities (Required) Tip: Refer to yourself in the third person.',
        }),
      ];

      userEvent.type(interestsInput, 'My Interests 1');
      expect(getByDisplayValue('My Interests 1')).toBeVisible();
      userEvent.type(responsibilitiesInput, 'My Responsibilities 1');
      expect(getByDisplayValue('My Responsibilities 1')).toBeVisible();

      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(interestsInput).not.toBeInTheDocument();
        expect(responsibilitiesInput).not.toBeInTheDocument();
      });

      expect(mockPatchUser).toHaveBeenCalledWith(
        id,
        {
          researchInterests: 'My Interests 1',
          responsibilities: 'My Responsibilities 1',
        },
        expect.any(String),
      );
    });
  });
  describe('team membership (REGRESSION)', () => {
    it('opens and closes the dialog', async () => {
      const {
        result: { current },
      } = renderHook(useFlags);
      current.disable('UPDATED_ROLE_SECTION');

      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
      userEvent.click(await findByLabelText(/edit.+team/i));
      expect(getByDisplayValue('My Interests')).toBeVisible();

      userEvent.click(getByText(/close/i));
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('interests')).not.toBeInTheDocument();
    });

    it('saves the changes from the dialog', async () => {
      const {
        result: { current },
      } = renderHook(useFlags);
      current.disable('UPDATED_ROLE_SECTION');

      const {
        getByText,
        queryByText,
        findByLabelText,
        getByDisplayValue,
        queryByDisplayValue,
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);

      userEvent.click(await findByLabelText(/example.+team/i));
      userEvent.type(getByDisplayValue('My Interests'), ' 2');
      expect(getByDisplayValue('My Interests 2')).toBeVisible();

      userEvent.type(getByDisplayValue('My Responsibilities'), ' 2');
      expect(getByDisplayValue('My Responsibilities 2')).toBeVisible();

      userEvent.click(getByText(/save/i));
      await waitFor(() => {
        expect(queryByText(/loading/i)).not.toBeInTheDocument();
        expect(queryByDisplayValue('My Interests 2')).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        id,
        {
          teams: [
            {
              id: '1',
              mainResearchInterests: 'My Interests 2',
              responsibilities: 'My Responsibilities 2',
            },
          ],
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
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
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
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
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
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
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
        findAllByLabelText,
      } = render(<Research user={user} />, { wrapper });

      await findAllByLabelText(/edit/i);
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

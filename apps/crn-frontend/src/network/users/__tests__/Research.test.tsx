import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import {
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  createListInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';
import { network } from '@asap-hub/routing';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import Research from '../Research';
import { patchUser } from '../api';
import { getResearchTags } from '../../../shared-research/api';
import { getUserInterestGroups } from '../interest-groups/api';

jest.mock('../api');
jest.mock('../interest-groups/api');
jest.mock('../../../shared-research/api');

const renderResearch = async (
  user = createUserResponse(),
  currentUserId = user.id,
) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: currentUserId }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({}).users({}).user({ userId: user.id }).research({}).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).users.template +
                  network({}).users({}).user.template +
                  network({}).users({}).user({ userId: user.id }).research
                    .template
                }
              >
                <Research user={user} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

const tags = ['1', '2', '3', '4', '5'];

describe('UserDetail', () => {
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockGetResearchTags = getResearchTags as jest.MockedFunction<
    typeof getResearchTags
  >;
  const mockGetUserInterestGroups =
    getUserInterestGroups as jest.MockedFunction<typeof getUserInterestGroups>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockGetResearchTags.mockResolvedValue(
      tags.map((tag) => ({ name: tag, id: tag })),
    );
    mockGetUserInterestGroups.mockResolvedValue(
      createListInterestGroupResponse(0),
    );
  });

  it('renders the profile research section', async () => {
    const user = {
      ...createUserResponse(),
      tags: [{ name: 'Some Expertise', id: '1' }],
    };
    await renderResearch(user);
    expect(screen.getByText('Some Expertise')).toBeVisible();
  });

  it('allows editing your own profile', async () => {
    await renderResearch();
    expect(screen.getAllByLabelText(/edit/i)).not.toHaveLength(0);
  });

  it("does not allow editing somebody else's profile", async () => {
    const user = {
      ...createUserResponse(),
      id: '12',
    };
    await renderResearch(user, '1337');
    expect(screen.queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  describe('editing role', () => {
    const user = {
      ...createUserResponse(),
      researchInterests: 'My Interests',
      responsibilities: 'My Responsibilities',
    };
    it('opens and closes the dialog', async () => {
      await renderResearch(user);
      userEvent.click(screen.getByLabelText(/edit.+role/i));
      expect(screen.getByDisplayValue('My Interests')).toBeVisible();
      userEvent.click(screen.getByText(/close/i));
      expect(
        screen.queryByDisplayValue('My Interests'),
      ).not.toBeInTheDocument();
    });

    it('saves the changes from the dialog', async () => {
      await renderResearch(user);
      userEvent.click(screen.getByLabelText(/edit.+role/i));

      userEvent.click(screen.getByText(/save/i));
      await waitFor(() => {
        expect(mockPatchUser).toHaveBeenCalledWith(
          user.id,
          {
            researchInterests: 'My Interests',
            responsibilities: 'My Responsibilities',
            reachOut: '',
          },
          expect.any(String),
        );
      });
    });
  });

  describe('editing expertise and resources', () => {
    const user = {
      ...createUserResponse(),
      expertiseAndResourceDescription: 'Expertise Description',
    };
    it('opens and closes the dialog', async () => {
      await renderResearch(user);

      userEvent.click(screen.getByLabelText(/edit.+resources/i));
      expect(screen.getByDisplayValue('Expertise Description')).toBeVisible();

      userEvent.click(screen.getByText(/close/i));
      expect(
        screen.queryByDisplayValue('Expertise Description'),
      ).not.toBeInTheDocument();
    });

    it('saves the changes from the dialog', async () => {
      await renderResearch(user);

      userEvent.click(screen.getByLabelText(/edit.+resources/i));
      userEvent.type(screen.getByDisplayValue('Expertise Description'), ' 2');
      expect(screen.getByDisplayValue('Expertise Description 2')).toBeVisible();
      tags.forEach((expertise) => {
        userEvent.type(screen.getByLabelText(/tags/i), expertise);
        userEvent.tab();
      });

      userEvent.click(screen.getByText(/save/i));
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        user.id,
        {
          tagIds: tags,
          expertiseAndResourceDescription: 'Expertise Description 2',
        },
        expect.any(String),
      );
    });
  });

  describe('questions', () => {
    const user = {
      ...createUserResponse(),
      questions: ['question 1', 'question 2', 'question 3', 'question 4'],
    };
    it('opens and closes the dialog', async () => {
      await renderResearch(user);
      userEvent.click(screen.getByLabelText(/edit.+questions/i));
      expect(screen.getByDisplayValue('question 1')).toBeVisible();

      userEvent.click(screen.getByText(/close/i));
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      expect(screen.queryByDisplayValue('question 1')).not.toBeInTheDocument();
    });

    it('saves the changes from the dialog', async () => {
      await renderResearch(user);

      userEvent.click(screen.getByLabelText(/edit.+questions/i));
      userEvent.type(screen.getByDisplayValue('question 1'), ' a');
      expect(screen.getByDisplayValue('question 1 a')).toBeVisible();

      userEvent.type(screen.getByDisplayValue('question 2'), ' b');
      expect(screen.getByDisplayValue('question 2 b')).toBeVisible();

      userEvent.type(screen.getByDisplayValue('question 3'), ' c');
      expect(screen.getByDisplayValue('question 3 c')).toBeVisible();
      userEvent.type(screen.getByDisplayValue('question 4'), ' d');
      expect(screen.getByDisplayValue('question 4 d')).toBeVisible();
      userEvent.click(screen.getByText(/save/i));
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      expect(mockPatchUser).toHaveBeenCalledWith(
        user.id,
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

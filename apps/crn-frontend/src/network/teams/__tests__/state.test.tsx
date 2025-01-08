import { createManuscriptResponse } from '@asap-hub/fixtures';
import {
  ManuscriptVersion,
  TeamDataObject,
  TeamManuscript,
} from '@asap-hub/model';
import { act, renderHook } from '@testing-library/react-hooks';
import * as recoilModule from 'recoil';
import {
  RecoilRoot,
  MutableSnapshot,
  useRecoilValue,
  useRecoilState,
} from 'recoil';
import { authorizationState } from '../../../auth/state';
import { endDiscussion } from '../api';
import {
  patchedTeamState,
  teamState,
  useEndDiscussion,
  useVersionById,
  versionSelector,
} from '../state';

const mockSetDiscussion = jest.fn();

jest.mock('../api', () => ({
  endDiscussion: jest.fn(),
}));

const teamId = 'team-id-0';

const teamMock = {
  id: 'id-0',
  teamId: 'team-id-0',
  tags: [{ id: 'tag-1', name: 'Research' }],
  members: [],
  lastModifiedDate: '2021-09-01T00:00:00Z',
  labCount: 1,
  displayName: 'Team One',
  projectTitle: 'Project Title',
};

const mockVersionData = createManuscriptResponse()
  .versions[0] as ManuscriptVersion;

describe('team selectors', () => {
  test('teamState selector retrieves team with tags', () => {
    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam: TeamDataObject = {
        ...teamMock,
        manuscripts: [],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(() => useRecoilValue(teamState(teamId)), {
      wrapper,
    });

    expect(result.current?.displayName).toBe('Team One');
    expect(result.current?.tags.length).toBe(1);
  });

  test('resets team state when newValue is undefined', () => {
    jest.spyOn(console, 'error').mockImplementation();
    const mockTeam = {
      id: 'id-0',
      teamId,
      tags: [],
      members: [],
      lastModifiedDate: '2021-09-01T00:00:00Z',
      labCount: 1,
      displayName: 'Team One',
      projectTitle: 'Project Title',
      manuscripts: [],
    };
    const initialState = ({ set }: MutableSnapshot) => {
      set(patchedTeamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () => {
        const [getTeamState, setTeamState] = useRecoilState(teamState(teamId));
        return { setTeamState, getTeamState };
      },
      { wrapper },
    );

    expect(result.current.getTeamState).toEqual(mockTeam);

    act(() => {
      result.current.setTeamState(undefined);
    });

    expect(result.current.getTeamState).toEqual(mockTeam);
  });
});

describe('versionSelector', () => {
  test('retrieves manuscript version', () => {
    const manuscriptId = 'manuscript-id-0';
    const versionId = 'version-id-0';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              {
                id: versionId,
              },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useRecoilValue(versionSelector({ teamId, manuscriptId, versionId })),
      {
        wrapper,
      },
    );

    expect(result.current?.id).toBe(versionId);
  });

  test('returns undefined if manuscript or version does not exist', () => {
    const manuscriptId = 'manuscript-id-0';
    const versionId = 'nonexistent-version-id';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              {
                id: 'version-id-0',
              },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useRecoilValue(versionSelector({ teamId, manuscriptId, versionId })),
      {
        wrapper,
      },
    );

    expect(result.current).toBeUndefined();
  });

  test('does not update version if versionId does not match', () => {
    const manuscriptId = 'manuscript-id-1';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              { id: 'version-id-1', description: 'Original Version 1' },
              { id: 'version-id-2', description: 'Original Version 2' },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useVersionById({
          teamId,
          manuscriptId,
          versionId: 'nonexistent-version-id',
        }),
      { wrapper },
    );

    const updateVersion = (prev: ManuscriptVersion) => ({
      ...prev,
      description: 'Updated description',
    });

    act(() => {
      result.current[1](updateVersion);
    });

    const updatedTeam = renderHook(() => useRecoilValue(teamState(teamId)), {
      wrapper,
    }).result.current;

    const originalVersions = updatedTeam?.manuscripts.find(
      (m) => m.id === manuscriptId,
    )?.versions;
    expect(originalVersions).toEqual([
      { id: 'version-id-1', description: 'Original Version 1' },
      { id: 'version-id-2', description: 'Original Version 2' },
    ]);
  });
});

describe('useVersionById hook', () => {
  test('retrieves manuscript version and allows updating', () => {
    const manuscriptId = 'manuscript-id-1';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [mockVersionData],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useVersionById({ teamId, manuscriptId, versionId: mockVersionData.id }),
      {
        wrapper,
      },
    );

    expect(result.current[0]?.id).toBe('version-1');

    const updateVersion = (prev: ManuscriptVersion) => ({
      ...prev,
      description: 'Updated description',
    });
    act(() => {
      result.current[1](updateVersion);
    });

    expect(result.current[0]?.description).toBe('Updated description');
  });

  test('only updates the matching version in the concerned manuscript and leaves other versions and manuscripts untouched', () => {
    const manuscriptId = 'manuscript-id-1';

    const initialState = ({ set }: MutableSnapshot) => {
      const mockTeam = {
        ...teamMock,
        manuscripts: [
          {
            id: manuscriptId,
            versions: [
              {
                ...mockVersionData,
                description: 'Original Version 1 Description',
              },
              {
                ...mockVersionData,
                id: 'version-2',
                description: 'Original Version 2 Description',
              },
            ],
          },
          {
            id: 'manuscript-id-2',
            versions: [
              {
                ...mockVersionData,
                id: 'version-3',
                description: 'Original Version 3 Description',
              },
            ],
          },
        ] as TeamManuscript[],
      };

      set(teamState(teamId), mockTeam);
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RecoilRoot initializeState={initialState}>{children}</RecoilRoot>
    );

    const { result } = renderHook(
      () =>
        useVersionById({ teamId, manuscriptId, versionId: mockVersionData.id }),
      {
        wrapper,
      },
    );

    expect(result.current[0]?.id).toBe('version-1');

    const updateVersion = (prev: ManuscriptVersion) => ({
      ...prev,
      description: 'Updated description',
    });
    act(() => {
      result.current[1](updateVersion);
    });

    expect(result.current[0]?.description).toBe('Updated description');

    const { result: resultState } = renderHook(
      () => useRecoilValue(teamState(teamId)),
      { wrapper },
    );

    const resultVersion =
      resultState.current && resultState.current.manuscripts
        ? resultState.current.manuscripts[1]
        : undefined;
    expect(resultVersion).toEqual({
      id: 'manuscript-id-2',
      versions: [
        {
          ...mockVersionData,
          id: 'version-3',
          description: 'Original Version 3 Description',
        },
      ],
    });
  });
});

describe('useEndDiscussion', () => {
  const mockAuthorization = 'mock-token';
  const discussionId = 'discussion-id-0';
  const mockDiscussion = {
    id: discussionId,
    title: 'Discussion Title',
    status: 'closed',
  };
  beforeEach(() => {
    jest
      .spyOn(require('recoil'), 'useRecoilValue')
      .mockImplementation((state) => {
        if (state === authorizationState) {
          return mockAuthorization;
        }
        return undefined;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls endDiscussion API with the correct parameters', async () => {
    (endDiscussion as jest.Mock).mockResolvedValue(mockDiscussion);

    const { result } = renderHook(() => useEndDiscussion(), {
      wrapper: RecoilRoot,
    });

    await act(async () => {
      await result.current(discussionId);
    });

    expect(endDiscussion).toHaveBeenCalledWith(discussionId, mockAuthorization);
  });

  test('does update discussion state on api error', async () => {
    const mockError = new Error('API error');
    (endDiscussion as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useEndDiscussion(), {
      wrapper: RecoilRoot,
    });

    await expect(
      act(async () => {
        await result.current(discussionId);
      }),
    ).rejects.toThrow();

    expect(mockSetDiscussion).not.toHaveBeenCalled();
  });
});

import { createManuscriptResponse } from '@asap-hub/fixtures';
import {
  ManuscriptDataObject,
  ManuscriptVersion,
  TeamDataObject,
} from '@asap-hub/model';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  RecoilRoot,
  MutableSnapshot,
  useRecoilValue,
  useRecoilState,
} from 'recoil';
import {
  patchedTeamState,
  teamState,
  useVersionById,
  versionSelector,
} from '../state';

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
        ] as ManuscriptDataObject[],
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
        ] as ManuscriptDataObject[],
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
        ] as ManuscriptDataObject[],
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
        ] as ManuscriptDataObject[],
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
        ] as ManuscriptDataObject[],
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

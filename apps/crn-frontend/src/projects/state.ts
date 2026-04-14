import {
  GrantType,
  ListProjectMilestonesResponse,
  ListProjectResponse,
  Milestone,
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectResponse,
  ProjectTool,
  ResearchOutputResponse,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { getResearchOutputs } from '../shared-research/api';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  createProjectMilestone,
  getProject,
  getProjectMilestones,
  getProjects,
  MilestonesListOptions,
  patchProject,
  ProjectListOptions,
  toListProjectResponse,
} from './api';

// Separate cache for list data (incomplete, from Algolia)
const projectListCacheState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  ProjectListOptions
>({ key: 'projectListCache', default: undefined });

// Cache for individual list items
const projectListItemState = atomFamily<ProjectResponse | undefined, string>({
  key: 'projectListItem',
  default: undefined,
});

export const projectsState = selectorFamily<
  ListProjectResponse | Error | undefined,
  ProjectListOptions
>({
  key: 'projects',
  get:
    (options) =>
    ({ get }) => {
      const index = get(projectListCacheState(options));
      if (index === undefined || index instanceof Error) return index;
      const projects: ProjectResponse[] = [];
      for (const id of index.ids) {
        const project = get(projectListItemState(id));
        if (project === undefined) return undefined;
        projects.push(project);
      }
      return {
        total: index.total,
        items: projects,
        algoliaIndexName: index.algoliaIndexName,
        algoliaQueryId: index.algoliaQueryId,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, projects) => {
      if (projects === undefined || projects instanceof DefaultValue) {
        const previous = get(projectListCacheState(options));
        if (previous && !(previous instanceof Error)) {
          previous.ids.forEach((id) => reset(projectListItemState(id)));
        }
        reset(projectListCacheState(options));
      } else if (projects instanceof Error) {
        set(projectListCacheState(options), projects);
      } else {
        // Cache list items separately (incomplete data)
        projects.items.forEach((project) =>
          set(projectListItemState(project.id), project),
        );
        set(projectListCacheState(options), {
          total: projects.total,
          ids: projects.items.map(({ id }) => id),
          algoliaIndexName: projects.algoliaIndexName,
          algoliaQueryId: projects.algoliaQueryId,
        });
      }
    },
});

export const refreshProjectState = atomFamily<number, string>({
  key: 'refreshProject',
  default: 0,
});

const fetchProjectState = selectorFamily<ProjectDetail | undefined, string>({
  key: 'fetchProject',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshProjectState(id));
      const authorization = get(authorizationState);
      return getProject(id, authorization);
    },
});

const projectState = atomFamily<ProjectDetail | undefined, string>({
  key: 'project',
  default: fetchProjectState,
});

export const useProjects = (options: ProjectListOptions) => {
  const [projects, setProjects] = useRecoilState(projectsState(options));
  const { client } = useAlgolia();
  if (projects === undefined) {
    throw getProjects(client, options)
      .then(toListProjectResponse)
      .then(setProjects)
      .catch(setProjects);
  }
  if (projects instanceof Error) {
    throw projects;
  }
  return projects;
};

// projectState is separate from list cache - always fetches complete detail data
// No need to reset since list data doesn't pollute this cache
export const useProjectById = (id: string) =>
  useRecoilState(projectState(id))[0];

export const usePatchProjectById = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setProject = useSetRecoilState(projectState(id));
  return async (patch: { tools: ProjectTool[] }) => {
    const updated = await patchProject(id, patch, authorization);
    // Always use patch.tools for the UI since the API may return stale data
    // due to Contentful's read-after-write delay.
    setProject({ ...updated, tools: patch.tools });
  };
};

export type MilestonesListOptionsWithVersion = MilestonesListOptions & {
  version: number;
};

export const projectMilestonesIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
    }
  | Error
  | undefined,
  MilestonesListOptionsWithVersion
>({ key: 'projectMilestonesListCache', default: undefined });

export const projectMilestonesListItemState = atomFamily<
  Milestone | undefined,
  string
>({
  key: 'projectMilestonesListItem',
  default: undefined,
});

const projectMilestonesVersionState = atomFamily<
  number,
  { projectId: string; grantType: GrantType | 'all' }
>({
  key: 'projectMilestonesVersion',
  default: 0,
});

export const projectMilestonesState = selectorFamily<
  ListProjectMilestonesResponse | Error | undefined,
  MilestonesListOptionsWithVersion
>({
  key: 'projectMilestones',
  get:
    (options) =>
    ({ get }) => {
      const index = get(projectMilestonesIndexState(options));
      if (index === undefined || index instanceof Error) return index;

      const projectMilestones: Milestone[] = [];
      for (const id of index.ids) {
        const projectMilestone = get(projectMilestonesListItemState(id));
        if (projectMilestone === undefined) return undefined;
        projectMilestones.push(projectMilestone);
      }
      return {
        total: index.total,
        items: projectMilestones,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, projectMilestones) => {
      if (
        projectMilestones === undefined ||
        projectMilestones instanceof DefaultValue
      ) {
        const previous = get(projectMilestonesIndexState(options));
        if (previous && !(previous instanceof Error)) {
          previous.ids.forEach((id) =>
            reset(projectMilestonesListItemState(id)),
          );
        }
        reset(projectMilestonesIndexState(options));
      } else if (projectMilestones instanceof Error) {
        set(projectMilestonesIndexState(options), projectMilestones);
      } else {
        projectMilestones.items.forEach((projectMilestone) =>
          set(
            projectMilestonesListItemState(projectMilestone.id),
            projectMilestone,
          ),
        );
        set(projectMilestonesIndexState(options), {
          total: projectMilestones.total,
          ids: projectMilestones.items.map(({ id }) => id),
        });
      }
    },
});

export const useProjectMilestones = (options: MilestonesListOptions) => {
  const version = useRecoilValue(
    projectMilestonesVersionState({
      projectId: options.projectId,
      grantType: options.grantType,
    }),
  );

  const key = { ...options, version };

  const [projectMilestones, setProjectMilestones] = useRecoilState(
    projectMilestonesState(key),
  );

  const authorization = useRecoilValue(authorizationState);

  if (projectMilestones === undefined) {
    throw getProjectMilestones(options, authorization)
      .then(setProjectMilestones)
      .catch(setProjectMilestones);
  }

  if (projectMilestones instanceof Error) {
    throw projectMilestones;
  }

  return projectMilestones;
};

export const useProjectArticlesSuggestions = (teamId: string) => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string) =>
    getResearchOutputs(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 5, // check the size
      filters: new Set(['Article']),
      teamId,
    }).then(({ hits }) =>
      (hits as ResearchOutputResponse[]).map(
        ({ id, title, documentType, type }) => ({
          label: title,
          value: id,
          documentType,
          type,
        }),
      ),
    );
};

export const useCreateProjectMilestone = (
  projectId: string,
  grantType: GrantType,
) => {
  const authorization = useRecoilValue(authorizationState);
  const bumpVersion = useSetRecoilState(
    projectMilestonesVersionState({ projectId, grantType }),
  );
  return async (data: MilestoneCreateRequest) => {
    const result = await createProjectMilestone(projectId, data, authorization);
    bumpVersion((v) => v + 1);
    return result.id;
  };
};

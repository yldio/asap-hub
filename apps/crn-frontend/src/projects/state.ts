import {
  ListProjectResponse,
  Milestone,
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectResponse,
  ProjectTool,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  createMilestone,
  getProject,
  getProjects,
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

export const useCreateMilestone = (projectId: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setProject = useSetRecoilState(projectState(projectId));
  return async (data: MilestoneCreateRequest) => {
    const result = await createMilestone(projectId, data, authorization);

    // Optimistically add the new milestone to local state so it appears
    // in the table immediately without waiting for Contentful's CDN cache.
    setProject((current) => {
      if (!current) return current;

      // Resolve aim IDs to aim order numbers from the project detail
      const allAims = [
        ...('originalGrantAims' in current && current.originalGrantAims
          ? current.originalGrantAims
          : []),
        ...('supplementGrant' in current && current.supplementGrant?.aims
          ? current.supplementGrant.aims
          : []),
      ];
      const aimOrders = data.aimIds
        .map((id) => allAims.find((a) => a.id === id)?.order)
        .filter((o): o is number => o !== undefined)
        .sort((a, b) => a - b);

      const newMilestone: Milestone = {
        id: result.id,
        description: data.description,
        status: data.status,
        aims: aimOrders.length > 0 ? aimOrders.join(',') : undefined,
      };
      const existing = current.milestones ?? [];
      return { ...current, milestones: [...existing, newMilestone] };
    });

    return result;
  };
};

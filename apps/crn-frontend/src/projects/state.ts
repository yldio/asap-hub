import { ListProjectResponse, ProjectResponse } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  getProject,
  getProjects,
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

const fetchProjectState = selectorFamily<ProjectResponse | undefined, string>({
  key: 'fetchProject',
  get:
    (id) =>
    async ({ get }) => {
      const authorization = get(authorizationState);
      return getProject(id, authorization);
    },
});

const projectState = atomFamily<ProjectResponse | undefined, string>({
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

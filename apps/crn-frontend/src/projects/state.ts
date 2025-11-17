import {
  ListProjectResponse,
  ProjectResponse,
  ProjectType,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  getProject,
  getProjects,
  ProjectListOptions,
  toListProjectResponse,
} from './api';

const projectIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  ProjectListOptions
>({ key: 'projectIndex', default: undefined });

export const projectsState = selectorFamily<
  ListProjectResponse | Error | undefined,
  ProjectListOptions
>({
  key: 'projects',
  get:
    (options) =>
    ({ get }) => {
      const index = get(
        projectIndexState({
          ...options,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const projects: ProjectResponse[] = [];
      for (const id of index.ids) {
        const project = get(projectState(id));
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
      const indexStateOptions = { ...options };
      if (projects === undefined || projects instanceof DefaultValue) {
        const previous = get(projectIndexState(indexStateOptions));
        if (previous && !(previous instanceof Error)) {
          previous.ids.forEach((id) => reset(projectState(id)));
        }
        reset(projectIndexState(indexStateOptions));
      } else if (projects instanceof Error) {
        set(projectIndexState(indexStateOptions), projects);
      } else {
        projects.items.forEach((project) =>
          set(projectState(project.id), project),
        );
        set(projectIndexState(indexStateOptions), {
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

export const useProjectById = (id: string) => useRecoilValue(projectState(id));

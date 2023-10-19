import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { useAlgolia } from '../hooks/algolia';
import {
  getProject,
  getProjects,
  ProjectListOptions,
  putProjectResources,
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
  gp2.ListProjectResponse | Error | undefined,
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
      const projects: gp2.ProjectResponse[] = [];
      for (const id of index.ids) {
        const project = get(projectState(id));
        if (project === undefined) return undefined;
        projects.push(project);
      }
      return {
        total: index.total,
        items: projects,
        algoliaQueryId: index.algoliaQueryId,
        algoliaIndexName: index.algoliaIndexName,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, projects) => {
      const indexStateOptions = { ...options };
      if (projects === undefined || projects instanceof DefaultValue) {
        const oldProjects = get(projectIndexState(indexStateOptions));
        if (!(oldProjects instanceof Error)) {
          oldProjects?.ids.forEach((id) => reset(projectState(id)));
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

const refreshProjectsState = atom<number>({
  key: 'refreshProjects',
  default: 0,
});

export const useProjects = (options: ProjectListOptions) => {
  const [projects, setProjects] = useRecoilState(projectsState(options));
  const { client } = useAlgolia();
  if (projects === undefined) {
    throw getProjects(client, options)
      .then(
        (data): gp2.ListProjectResponse => ({
          total: data.nbHits,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        }),
      )
      .then(setProjects)
      .catch(setProjects);
  }
  if (projects instanceof Error) {
    throw projects;
  }
  return projects;
};
const fetchProjectState = selectorFamily<
  gp2.ProjectResponse | undefined,
  string
>({
  key: 'fetchProject',
  get:
    (id) =>
    async ({ get }) => {
      const authorization = get(authorizationState);
      return getProject(id, authorization);
    },
});

const projectState = atomFamily<gp2.ProjectResponse | undefined, string>({
  key: 'project',
  default: fetchProjectState,
});

export const useProjectById = (id: string) => useRecoilValue(projectState(id));

export const usePutProjectResources = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setProjectItem = useSetProjectItem();
  return async (payload: gp2.ProjectResourcesPutRequest) => {
    const project = await putProjectResources(id, payload, authorization);
    setProjectItem(project);
  };
};

const useSetProjectItem = () => {
  const [refresh, setRefresh] = useRecoilState(refreshProjectsState);
  return useRecoilCallback(({ set }) => (project: gp2.ProjectResponse) => {
    setRefresh(refresh + 1);
    set(projectState(project.id), project);
  });
};

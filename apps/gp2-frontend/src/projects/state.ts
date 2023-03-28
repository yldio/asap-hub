import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { getProject, getProjects, putProjectResources } from './api';

const projectsState = selectorFamily<gp2.ListProjectResponse, GetListOptions>({
  key: 'projects',
  get:
    (options) =>
    ({ get }) =>
      getProjects(get(authorizationState), options),
});

const refreshProjectsState = atom<number>({
  key: 'refreshProjects',
  default: 0,
});

export const useProjectsState = (options: GetListOptions) =>
  useRecoilValue(projectsState(options));

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

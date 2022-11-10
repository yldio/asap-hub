import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  ReadWriteSelectorOptions,
  selector,
  selectorFamily,
  SetRecoilState,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { getProject, getProjects, putProjectResources } from './api';

export const fetchProjectsState = selector<gp2.ListProjectResponse>({
  key: 'fetchProjectsState',
  get: ({ get }) => {
    get(refreshProjectsState);
    return getProjects(get(authorizationState));
  },
});

export const projectsState = atom<gp2.ListProjectResponse>({
  key: 'projectState',
  default: fetchProjectsState,
});

export const refreshProjectsState = atom<number>({
  key: 'refreshProjectsState',
  default: 0,
});

export const refreshProjectState = atomFamily<number, string>({
  key: 'refreshProject',
  default: 0,
});

export const useProjectsState = () => useRecoilValue(projectsState);

const fetchProjectState = selectorFamily<
  gp2.ProjectResponse | undefined,
  string
>({
  key: 'fetchProject',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshProjectState(id));
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

export const useSetProjectItem = () => {
  const [refresh, setRefresh] = useRecoilState(refreshProjectsState);
  const setProjectItem = useSetRecoilState(setProject);
  return (project: gp2.ProjectResponse) => {
    setProjectItem(project);
    setRefresh(refresh + 1);
  };
};

const setProject = selector<gp2.ProjectResponse>({
  key: 'setProject',
  set: ({ set }: { set: SetRecoilState }, project: gp2.ProjectResponse) => {
    set(projectState(project.id), project);
  },
} as unknown as ReadWriteSelectorOptions<gp2.ProjectResponse>);

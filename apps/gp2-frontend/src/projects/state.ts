import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { getProject, getProjects } from './api';

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

export const useProjectsState = () => useRecoilValue(projectsState);

export const useProjectById = (id: string) => useRecoilValue(projectState(id));

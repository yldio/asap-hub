import { gp2 } from '@asap-hub/model';
import { atom, atomFamily, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getProjects } from './api';

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

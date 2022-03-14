import { selector, atom, useRecoilValue } from 'recoil';
import { DashboardResponse } from '@asap-hub/model';
import { authorizationState } from '../auth/state';
import { getDashboard } from './api';

export const fetchDashboardState = selector<DashboardResponse>({
  key: 'fetchDashboardState',
  get: ({ get }) => {
    get(refreshDashboardState);
    return getDashboard(get(authorizationState));
  },
});

export const dashboardState = atom<DashboardResponse>({
  key: 'dashboardState',
  default: fetchDashboardState,
});

export const refreshDashboardState = atom<number>({
  key: 'refreshDashboardState',
  default: 0,
});

export const useDashboardState = () => useRecoilValue(dashboardState);

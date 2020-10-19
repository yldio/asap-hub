import { DashboardResponse } from '@asap-hub/model';

import { useGetOne } from './get-one';

export const useDashboard = () => useGetOne<DashboardResponse>(`dashboard`);

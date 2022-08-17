import { DashboardResponse, ListReminderResponse } from '@asap-hub/model';
import {
  createDashboardResponse,
  createListReminderResponse,
} from '@asap-hub/fixtures';

export const getDashboard = jest.fn(
  async (): Promise<DashboardResponse> => createDashboardResponse(),
);

export const getReminders = jest.fn(
  async (): Promise<ListReminderResponse> => createListReminderResponse(3),
);

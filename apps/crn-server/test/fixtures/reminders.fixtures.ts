import { ListReminderResponse, ReminderResponse } from '@asap-hub/model';

export const getReminderResponse = (): ReminderResponse => ({
  entity: 'Research Output',
  type: 'Published',
  data: {
    researchOutputId: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  },
});

export const getListReminderResponse = (): ListReminderResponse => ({
  total: 1,
  items: [getReminderResponse()],
});

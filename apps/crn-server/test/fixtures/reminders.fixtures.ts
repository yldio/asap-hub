import {
  ListReminderDataObject,
  ListReminderResponse,
  ReminderDataObject,
  ReminderResponse,
} from '@asap-hub/model';

export const getReminderDataObject = (): ReminderDataObject => ({
  entity: 'Research Output',
  type: 'Published',
  data: {
    researchOutputId: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  },
});

export const getListReminderDataObject = (): ListReminderDataObject => ({
  total: 1,
  items: [getReminderDataObject()],
});

export const getReminderResponse = (): ReminderResponse =>
  getReminderDataObject();

export const getListReminderResponse = (): ListReminderResponse => ({
  total: 1,
  items: [getReminderResponse()],
});

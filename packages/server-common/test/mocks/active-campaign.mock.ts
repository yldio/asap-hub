import {
  addContactToList,
  createContact,
  getContactFieldValues,
  getContactIdByEmail,
  getCustomFieldIdByTitle,
  getListIdByName,
  unsubscribeContactFromAllLists,
  updateContact,
  updateListStatusForContact,
} from '../../src/utils/active-campaign';

export const mockActiveCampaign = {
  addContactToList: jest.fn() as jest.MockedFunction<typeof addContactToList>,
  createContact: jest.fn() as jest.MockedFunction<typeof createContact>,
  getContactFieldValues: jest.fn() as jest.MockedFunction<
    typeof getContactFieldValues
  >,
  getContactIdByEmail: jest.fn() as jest.MockedFunction<
    typeof getContactIdByEmail
  >,
  getCustomFieldIdByTitle: jest.fn() as jest.MockedFunction<
    typeof getCustomFieldIdByTitle
  >,
  getListIdByName: jest.fn() as jest.MockedFunction<typeof getListIdByName>,
  unsubscribeContactFromAllLists: jest.fn() as jest.MockedFunction<
    typeof unsubscribeContactFromAllLists
  >,
  updateContact: jest.fn() as jest.MockedFunction<typeof updateContact>,
  updateListStatusForContact: jest.fn() as jest.MockedFunction<
    typeof updateListStatusForContact
  >,
};

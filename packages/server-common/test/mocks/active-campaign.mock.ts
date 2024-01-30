import {
  createContact,
  getContactIdByEmail,
  updateContact,
} from '../../src/utils/active-campaign';

export const mockGetContactIdByEmail = jest.fn() as jest.MockedFunction<
  typeof getContactIdByEmail
>;

export const mockCreateContact = jest.fn() as jest.MockedFunction<
  typeof createContact
>;

export const mockUpdateContact = jest.fn() as jest.MockedFunction<
  typeof updateContact
>;

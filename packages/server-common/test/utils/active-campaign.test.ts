import nock from 'nock';

import type {
  ContactListsResponse,
  FieldValuesResponse,
  ListIdByName,
  ListsResponse,
} from '../../src/utils/active-campaign';
import {
  addContactToList,
  createContact,
  getActiveCampaignApiURL,
  getActiveCampaignHeaders,
  getContactFieldValues,
  getContactIdByEmail,
  getCustomFieldIdByTitle,
  getListIdByName,
  unsubscribeContactFromLists,
  updateContact,
} from '../../src/utils/active-campaign';

const account = 'account';
const token = 'api-token';

describe('addContactToList', () => {
  const contactId = '23';
  const listId = '3';
  const expectedRequestBody = {
    contactList: {
      list: listId,
      contact: contactId,
      status: 1,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request with expected request body', async () => {
    nock(`https://${account}.api-us1.com`)
      .post(`/api/3/contactLists`, expectedRequestBody)
      .reply(200);

    await addContactToList(account, token, contactId, listId);

    expect(nock.isDone()).toBe(true);
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`)
      .post('/api/3/contactLists', expectedRequestBody)
      .reply(500);

    await expect(
      addContactToList(account, token, contactId, listId),
    ).rejects.toThrow();
  });
});

describe('createContact', () => {
  const contact = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    fieldValues: [{ field: 'field1', value: 'value1' }],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request and return contact response', async () => {
    const mockContact = {
      contact: {
        id: '123',
        cdate: '2024-01-18T03:00:00-06:00',
        udate: '2024-01-18T03:00:00-06:00',
      },
    };

    nock(`https://${account}.api-us1.com`)
      .post('/api/3/contacts')
      .reply(201, mockContact);

    const result = await createContact(account, token, contact);

    expect(result).toEqual(mockContact);
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`).post('/api/3/contacts').reply(500);

    await expect(createContact(account, token, contact)).rejects.toThrow();
  });
});

describe('getActiveCampaignApiURL', () => {
  it('should return the correct API URL for the given account', () => {
    const account = 'asap';

    expect(getActiveCampaignApiURL(account)).toBe(
      'https://asap.api-us1.com/api/3',
    );
  });
});

describe('getActiveCampaignHeaders', () => {
  it('should return the correct headers object with the provided token', () => {
    const token = 'my-api-token';
    expect(getActiveCampaignHeaders(token)).toEqual({
      'Api-Token': 'my-api-token',
    });
  });
});

describe('getContactFieldValues', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const contactId = '42';
  const mockFieldValues: FieldValuesResponse = {
    fieldValues: [
      { field: '12', value: 'Alumni' },
      { field: '2', value: 'Brazil' },
    ],
  };
  it('should make a successful request and return custom fields response', async () => {
    nock(`https://${account}.api-us1.com`)
      .get(`/api/3/contacts/${contactId}/fieldValues`)
      .reply(200, mockFieldValues);

    const result = await getContactFieldValues(account, token, contactId);

    expect(result).toEqual(mockFieldValues);
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`)
      .get(`/api/3/contacts/${contactId}/fieldValues`)
      .reply(500);

    await expect(
      getContactFieldValues(account, token, contactId),
    ).rejects.toThrow();
  });
});

describe('getContactIdByEmail', () => {
  const mockApiUrl = `https://${account}.api-us1.com`;
  const mockEmail = 'test@example.com';

  it('should return contact ID if the contact is found', async () => {
    const mockResponse = {
      contacts: [
        {
          id: 'mock-contact-id',
          email: mockEmail,
        },
      ],
    };

    nock(mockApiUrl)
      .get(`/api/3/contacts?filters[email]=${mockEmail}`)
      .reply(200, mockResponse);

    const result = await getContactIdByEmail(account, token, mockEmail);

    expect(result).toEqual('mock-contact-id');
  });

  it('should return null if the contact is not found', async () => {
    const mockResponse = {
      contacts: [],
    };

    nock(mockApiUrl)
      .get(`/api/3/contacts?filters[email]=${mockEmail}`)
      .reply(200, mockResponse);

    const result = await getContactIdByEmail(account, token, mockEmail);

    expect(result).toBeNull();
  });

  it('should throw an error if api returns an error', async () => {
    nock(mockApiUrl)
      .get(`/api/3/contacts?filters[email]=${mockEmail}`)
      .reply(500, 'Internal Server Error');

    await expect(
      getContactIdByEmail(account, token, mockEmail),
    ).rejects.toThrow();
  });
});

describe('getCustomFieldIdByTitle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request and return custom field id by title', async () => {
    const mockCustomFields = {
      fields: [
        { title: 'Team', id: '10' },
        { title: 'CRN Team Role', id: '15' },
        { title: 'ORCID', id: '16' },
        { title: 'Nickname', id: '19' },
        { title: 'Middlename', id: '20' },
        { title: 'Alumnistatus', id: '12' },
        { title: 'Country', id: '3' },
        { title: 'Institution', id: '9' },
        { title: 'LinkedIn', id: '28' },
      ],
    };

    nock(`https://${account}.api-us1.com`)
      .get('/api/3/fields?limit=100')
      .reply(201, mockCustomFields);

    const result = await getCustomFieldIdByTitle(account, token);

    expect(result).toEqual({
      Alumnistatus: '12',
      'CRN Team Role': '15',
      Country: '3',
      Institution: '9',
      LinkedIn: '28',
      Middlename: '20',
      Nickname: '19',
      ORCID: '16',
      Team: '10',
    });
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`)
      .get('/api/3/fields?limit=100')
      .reply(500);

    await expect(getCustomFieldIdByTitle(account, token)).rejects.toThrow();
  });
});

describe('getListIdByName', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request and return list id by name', async () => {
    const mockListsResponse: ListsResponse = {
      lists: [
        { name: 'Master List', id: '1' },
        { name: 'GP2 Hub Email list', id: '2' },
        { name: 'CRN HUB Email List', id: '3' },
      ],
    };

    nock(`https://${account}.api-us1.com`)
      .get('/api/3/lists')
      .reply(201, mockListsResponse);

    const result = await getListIdByName(account, token);
    expect(result).toEqual({
      'Master List': '1',
      'GP2 Hub Email list': '2',
      'CRN HUB Email List': '3',
    });
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`).get('/api/3/lists').reply(500);

    await expect(getListIdByName(account, token)).rejects.toThrow();
  });
});

describe('unsubscribeContactFromLists', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const contactId = '26';
  const listId1 = '3';
  const listId2 = '5';
  const getExpectedRequestBody = (listId: string) => ({
    contactList: {
      list: listId,
      contact: contactId,
      status: 2,
    },
  });
  const listIdByName: ListIdByName = {
    'Master List': '1',
    'GP2 Hub Email list': '2',
    'CRN HUB Email List': '3',
  };

  it('should make a successful requests to get contact lists and unsubscribe from them', async () => {
    const mockContactListsResponse: ContactListsResponse = {
      contactLists: [
        { list: listId1, contact: '1' },
        { list: listId2, contact: '1' },
      ],
    };

    nock(`https://${account}.api-us1.com`)
      .get(`/api/3/contacts/${contactId}/contactLists`)
      .reply(200, mockContactListsResponse);

    nock(`https://${account}.api-us1.com`)
      .post(`/api/3/contactLists`, getExpectedRequestBody(listId1))
      .reply(200);

    nock(`https://${account}.api-us1.com`)
      .post(`/api/3/contactLists`, getExpectedRequestBody(listId2))
      .reply(200);

    await unsubscribeContactFromLists(account, token, contactId, listIdByName);

    expect(nock.isDone()).toBe(true);
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`)
      .get(`/api/3/contacts/${contactId}/contactLists`)
      .reply(500);

    await expect(
      unsubscribeContactFromLists(account, token, contactId, listIdByName),
    ).rejects.toThrow();
  });
});

describe('updateContact', () => {
  const contact = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    fieldValues: [{ field: 'field1', value: 'value1' }],
  };

  const mockContact = {
    contact: {
      id: '123',
      cdate: '2024-01-18T03:00:00-06:00',
      udate: '2024-01-18T03:00:00-06:00',
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request and return contact response', async () => {
    nock(`https://${account}.api-us1.com`)
      .put(`/api/3/contacts/${mockContact.contact.id}`)
      .reply(201, mockContact);

    const result = await updateContact(
      account,
      token,
      mockContact.contact.id,
      contact,
    );

    expect(result).toEqual(mockContact);
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`)
      .put(`/api/3/contacts/${mockContact.contact.id}`)
      .reply(500);

    await expect(
      updateContact(account, token, mockContact.contact.id, contact),
    ).rejects.toThrow();
  });
});

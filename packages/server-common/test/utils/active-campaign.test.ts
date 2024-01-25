import nock from 'nock';

import {
  createContact,
  updateContact,
  getCustomFields,
  getCustomFieldIdByTitle,
  getContactIdByEmail,
} from '../../src/utils/active-campaign';

const account = 'account';
const token = 'api-token';

describe('createActiveCampaignContact', () => {
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

describe('getCustomFields', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request and return custom fields response', async () => {
    const mockCustomFields = {
      fields: [
        { title: 'Team', id: '10' },
        { title: 'ORCID', id: '16' },
      ],
    };

    nock(`https://${account}.api-us1.com`)
      .get('/api/3/fields')
      .reply(201, mockCustomFields);

    const result = await getCustomFields(account, token);

    expect(result).toEqual(mockCustomFields);
  });

  it('should throw an error if api returns an error', async () => {
    nock(`https://${account}.api-us1.com`).get('/api/3/fields').reply(500);

    await expect(getCustomFields(account, token)).rejects.toThrow();
  });
});

describe('getCustomFieldIdByTitle', () => {
  it('returns the an object with fields title by id', () => {
    expect(
      getCustomFieldIdByTitle({
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
      }),
    ).toEqual({
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

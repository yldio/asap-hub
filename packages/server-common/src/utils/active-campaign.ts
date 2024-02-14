import { UserResponse, gp2 } from '@asap-hub/model';
import Got from 'got';

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  fieldValues: {
    field: string;
    value: string;
  }[];
};

export type ContactResponse = {
  contact: {
    id: string;
    cdate: string;
    udate: string;
  };
};

export type CRNFields =
  | 'Lab'
  | 'ORCID'
  | 'Nickname'
  | 'Middlename'
  | 'Alumnistatus'
  | 'Country'
  | 'Institution'
  | 'Working Group'
  | 'Interest Group'
  | 'LinkedIn'
  | 'Network'
  | 'CRN Team 1'
  | 'CRN Team Role 1'
  | 'CRN Team Status 1'
  | 'CRN Team 2'
  | 'CRN Team Role 2'
  | 'CRN Team Status 2'
  | 'CRN Team 3'
  | 'CRN Team Role 3'
  | 'CRN Team Status 3';

export type CRNFieldIdByTitle = Record<CRNFields, string>;

export type GP2Fields =
  | 'ORCID'
  | 'Nickname'
  | 'Middlename'
  | 'Country'
  | 'Region'
  | 'Department'
  | 'Institution'
  | 'GP2 Hub Role'
  | 'GP2 Working Group'
  | 'Project'
  | 'LinkedIn'
  | 'Network';

export type GP2FieldIdByTitle = Record<GP2Fields, string>;

export type GetContactPayloadCRN = (
  fieldIdByTitle: CRNFieldIdByTitle,
  user: UserResponse,
) => ContactPayload;

export type GetContactPayloadGP2 = (
  fieldIdByTitle: GP2FieldIdByTitle,
  user: gp2.UserResponse,
) => ContactPayload;

export type GetContactPayload = GetContactPayloadCRN | GetContactPayloadGP2;

export const getActiveCampaignApiURL = (account: string) =>
  `https://${account}.api-us1.com/api/3`;

export const getActiveCampaignHeaders = (token: string) => ({
  'Api-Token': token,
});

/**
 * @see {@link https://developers.activecampaign.com/reference/update-list-status-for-contact}
 */
export const addContactToList = async (
  account: string,
  token: string,
  contactId: string,
  listId: string,
): Promise<void> => {
  await updateListStatusForContact(
    account,
    token,
    'subscribe',
    contactId,
    listId,
  );
};

/**
 * @see {@link https://developers.activecampaign.com/reference/create-a-new-contact}
 */
export const createContact = async (
  account: string,
  token: string,
  contact: ContactPayload,
): Promise<ContactResponse> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  return Got.post(`${apiURL}/contacts`, {
    json: { contact },
    headers,
  }).json();
};

export type FieldValues = {
  field: string;
  value: string;
}[];

export type FieldValuesResponse = {
  fieldValues: FieldValues;
};

/**
 * @see {@link https://developers.activecampaign.com/reference/retrieve-contact-field-values}
 */
export const getContactFieldValues = async (
  account: string,
  token: string,
  contactId: string,
): Promise<FieldValuesResponse> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  return Got.get(`${apiURL}/contacts/${contactId}/fieldValues`, {
    headers,
  }).json<FieldValuesResponse>();
};

type ContactByEmailResponse = {
  contacts: {
    id: string;
    email: string;
  }[];
};

/**
 * @see {@link https://developers.activecampaign.com/reference/list-all-contacts}
 */
export const getContactIdByEmail = async (
  account: string,
  token: string,
  email: string,
): Promise<string | null> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  const result = await Got.get(`${apiURL}/contacts?filters[email]=${email}`, {
    headers,
  }).json<ContactByEmailResponse>();

  if (result.contacts.length && result.contacts[0]?.id) {
    return result.contacts[0].id;
  }

  return null;
};

export type FieldIdByTitle = CRNFieldIdByTitle | GP2FieldIdByTitle;

type CustomFieldsResponse = {
  fields: {
    title: string;
    id: string;
  }[];
};

/**
 * @see {@link https://developers.activecampaign.com/reference/retrieve-fields}
 */
export const getCustomFieldIdByTitle = async (
  account: string,
  token: string,
): Promise<FieldIdByTitle> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  const customFieldsResponse = await Got.get(`${apiURL}/fields?limit=100`, {
    headers,
  }).json<CustomFieldsResponse>();

  return customFieldsResponse.fields.reduce(
    (fieldIdByTitle: FieldIdByTitle, field) => ({
      ...fieldIdByTitle,
      [field.title]: field.id,
    }),
    {} as FieldIdByTitle,
  );
};

export type ListsResponse = {
  lists: {
    name: string;
    id: string;
  }[];
};

export type ListIdByName = {
  [name: string]: string;
};

/**
 * @see {@link https://developers.activecampaign.com/reference/retrieve-all-lists}
 */
export const getListIdByName = async (
  account: string,
  token: string,
): Promise<ListIdByName> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  const listsResponse = await Got.get(`${apiURL}/lists`, {
    headers,
  }).json<ListsResponse>();

  return listsResponse.lists.reduce(
    (listIdByName: ListIdByName, list) => ({
      ...listIdByName,
      [list.name]: list.id,
    }),
    {},
  );
};

export type ContactListsResponse = {
  contactLists: {
    contact: string;
    list: string;
  }[];
};
/**
 * @see {@link https://developers.activecampaign.com/reference/retrieve-contact-list-memberships}
 */
export const unsubscribeContactFromAllLists = async (
  account: string,
  token: string,
  contactId: string,
): Promise<void> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  const lists = await Got.get(`${apiURL}/contacts/${contactId}/contactLists`, {
    headers,
  }).json<ContactListsResponse>();

  const listIds = lists.contactLists.map((item) => item.list);

  await Promise.all(
    listIds.map(async (listId) => {
      await updateListStatusForContact(
        account,
        token,
        'unsubscribe',
        contactId,
        listId,
      );
    }),
  );
};

/**
 * @see {@link https://developers.activecampaign.com/reference/update-a-contact-new}
 */
export const updateContact = async (
  account: string,
  token: string,
  id: string,
  contact: ContactPayload,
): Promise<ContactResponse> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  return Got.put(`${apiURL}/contacts/${id}`, {
    json: { contact },
    headers,
  }).json();
};

/**
 * @see {@link https://developers.activecampaign.com/reference/update-list-status-for-contact}
 */
export const updateListStatusForContact = async (
  account: string,
  token: string,
  action: 'subscribe' | 'unsubscribe',
  contactId: string,
  listId: string,
): Promise<void> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  await Got.post(`${apiURL}/contactLists`, {
    json: {
      contactList: {
        list: listId,
        contact: contactId,
        status: action === 'subscribe' ? 1 : 2,
      },
    },
    headers,
  }).json();
};

export const ActiveCampaign = {
  addContactToList,
  createContact,
  getContactFieldValues,
  getContactIdByEmail,
  getCustomFieldIdByTitle,
  getListIdByName,
  updateContact,
};

export type ActiveCampaignType = {
  addContactToList: (
    account: string,
    token: string,
    contactId: string,
    listId: string,
  ) => Promise<void>;
  createContact: (
    account: string,
    token: string,
    contact: ContactPayload,
  ) => Promise<ContactResponse>;
  getContactFieldValues: (
    account: string,
    token: string,
    contactId: string,
  ) => Promise<FieldValuesResponse>;
  getContactIdByEmail: (
    account: string,
    token: string,
    email: string,
  ) => Promise<string | null>;
  getCustomFieldIdByTitle: (
    account: string,
    token: string,
  ) => Promise<CRNFieldIdByTitle | GP2FieldIdByTitle>;
  getListIdByName: (account: string, token: string) => Promise<ListIdByName>;
  unsubscribeContactFromAllLists: (
    account: string,
    token: string,
    contactId: string,
  ) => Promise<void>;
  updateContact: (
    account: string,
    token: string,
    id: string,
    contact: ContactPayload,
  ) => Promise<ContactResponse>;
  updateListStatusForContact: (
    account: string,
    token: string,
    action: 'subscribe' | 'unsubscribe',
    contactId: string,
    listId: string,
  ) => Promise<void>;
};

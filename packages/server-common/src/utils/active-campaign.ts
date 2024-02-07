import Got from 'got';

export const getActiveCampaignApiURL = (account: string) =>
  `https://${account}.api-us1.com/api/3`;

export const getActiveCampaignHeaders = (token: string) => ({
  'Api-Token': token,
});

/**
 * @see {@link https://developers.activecampaign.com/reference/update-list-status-for-contact}
 */
export const addContactToList = (
  account: string,
  token: string,
  contactId: string,
  listId: string,
) => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  return Got.post(`${apiURL}/contactLists`, {
    json: {
      contactList: {
        list: listId,
        contact: contactId,
        status: 1,
      },
    },
    headers,
  }).json();
};

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

export type FieldValuesResponse = {
  fieldValues: {
    field: string;
    value: string;
  }[];
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

export type FieldIdByTitle = {
  [title: string]: string;
};

type CustomFieldsResponse = {
  fields: {
    title: string;
    id: string;
  }[];
};

export const getCustomFieldIdByTitle = (
  customFieldsResponse: CustomFieldsResponse,
): FieldIdByTitle =>
  customFieldsResponse.fields.reduce(
    (fieldIdByTitle: FieldIdByTitle, field) => ({
      ...fieldIdByTitle,
      [field.title]: field.id,
    }),
    {},
  );

/**
 * @see {@link https://developers.activecampaign.com/reference/retrieve-fields}
 */
export const getCustomFields = async (
  account: string,
  token: string,
): Promise<CustomFieldsResponse> => {
  const apiURL = getActiveCampaignApiURL(account);
  const headers = getActiveCampaignHeaders(token);

  return Got.get(`${apiURL}/fields?limit=100`, {
    headers,
  }).json<CustomFieldsResponse>();
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
export const getListIdByName = async (account: string, token: string) => {
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

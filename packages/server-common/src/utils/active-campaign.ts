import Got from 'got';

type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  fieldValues: {
    field: string;
    value: string;
  }[];
};

type ContactResponse = {
  contact: {
    id: string;
    cdate: string;
    udate: string;
  };
};

export const createContact = async (
  account: string,
  token: string,
  contact: ContactPayload,
): Promise<ContactResponse> => {
  const apiURL = `https://${account}.api-us1.com/api/3`;

  return Got.post(`${apiURL}/contacts`, {
    json: { contact },
    headers: { 'Api-Token': token },
  }).json();
};

export const updateContact = async (
  account: string,
  token: string,
  id: string,
  contact: ContactPayload,
): Promise<ContactResponse> => {
  const apiURL = `https://${account}.api-us1.com/api/3`;

  return Got.put(`${apiURL}/contacts/${id}`, {
    json: { contact },
    headers: { 'Api-Token': token },
  }).json();
};

type CustomFieldsResponse = {
  fields: {
    title: string;
    id: string;
  }[];
};

export const getCustomFields = async (
  account: string,
  token: string,
): Promise<CustomFieldsResponse> => {
  const apiURL = `https://${account}.api-us1.com/api/3`;

  return Got.get(`${apiURL}/fields`, {
    headers: { 'Api-Token': token },
  }).json();
};

type FieldIdByTitle = {
  [title: string]: string;
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

type ContactByEmailResponse = {
  contacts: {
    id: string;
    email: string;
  }[];
};
export const getContactIdByEmail = async (
  account: string,
  token: string,
  email: string,
): Promise<string | null> => {
  const apiURL = `https://${account}.api-us1.com/api/3`;

  const result = await Got.get(`${apiURL}/contacts?filters[email]=${email}`, {
    headers: { 'Api-Token': token },
  }).json<ContactByEmailResponse>();

  if (result.contacts.length && result.contacts[0]?.id) {
    return result.contacts[0].id;
  }

  return null;
};

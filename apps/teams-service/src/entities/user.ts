export interface CMSUser {
  id: string;
  data: {
    displayName: { iv: string };
    email: { iv: string };
    firstName: { iv: string };
    middleName: { iv: string };
    lastName: { iv: string };
    title: { iv: string };
    orcid: { iv: string };
    institution: { iv: string };
    connections: { iv: [{ code: string }] };
  };
}

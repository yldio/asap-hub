export interface Data {
  applicationNumber: string;
  degree: string;
  email: string;
  firstName: string;
  institution: string;
  jobTitle: string;
  lastName: string;
  orcid: string;
  projectTitle: string;
  role: string;
}

export default (data: string[]): Data => {
  const [
    applicationNumber,
    projectTitle,
    firstName,
    lastName,
    role,
    institution,
    degree,
    jobTitle,
    ,
    email,
    norcid,
  ] = data.map((s) => s.trim());

  const orcid = norcid.match(/((\d|X){4}-(\d|X){4}-(\d|X){4}-(\d|X){4})/i);
  return {
    applicationNumber,
    projectTitle,
    firstName,
    lastName,
    role,
    institution,
    degree,
    jobTitle,
    email,
    orcid: orcid ? orcid[0] : '',
  };
};

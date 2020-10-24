export interface Data {
  email: string;
  application: string;
  role: string;
  projectTitle: string;
  firstName: string;
  lastName: string;
  institution: string;
  degree: string;
  jobTitle: string;
  orcid: string;
  questions: string[];
  biography: string;
  researchInterest: string;
  approach: string;
  skills: string[];
  skillsDescription: string;
}

export default (data: string[]): Data => {
  const [
    email,
    application,
    role,
    projectTitle,
    firstName,
    lastName,
    institution,
    degree,
    jobTitle,
    norcid,
    question1,
    question2,
    question3,
    question4,
    skillsDescription,
    biography,
    researchInterest,
    approach,
    skills,
  ] = data.map((s) => s.trim());

  const orcid = norcid.match(/((\d|X){4}-(\d|X){4}-(\d|X){4}-(\d|X){4})/i);
  return {
    application,
    approach,
    biography,
    degree,
    email,
    firstName,
    institution,
    jobTitle,
    lastName,
    orcid: orcid ? orcid[0] : '',
    projectTitle,
    questions: [question1, question2, question3, question4].filter(Boolean),
    researchInterest,
    role,
    skills: skills
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean),
    skillsDescription
  };
};

import { URL } from 'url';
import { RestUser } from '@asap-hub/squidex';
import { TeamRole } from '@asap-hub/model';

type Role = RestUser['data']['role']['iv'];
type Degree = NonNullable<RestUser['data']['degree']>['iv'] | undefined;

export interface Data {
  email: string;
  application: string;
  role: TeamRole;
  projectTitle: string;
  firstName: string;
  lastName: string;
  institution: string;
  degree: Degree;
  jobTitle: string;
  orcid: string;
  questions: string[];
  biography: string;
  researchInterest: string;
  responsibilities: string;
  skills: string[];
  skillsDescription: string;
  asapRole: Role;
  social: {
    website1?: string;
    website2?: string;
    linkedIn?: string;
    orcid?: string;
    researcherId?: string;
    twitter?: string;
    github?: string;
    googleScholar?: string;
    researchGate?: string;
  };
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
    responsibilities,
    skills,
    asapRole,
    ,
    website1,
    website2,
    linkedIn,
    googleScholar,
    gitHub,
    researchGate,
    researcherID,
    twitter,
  ] = data.map((s) => s.trim());

  const orcid = norcid?.match(/((\d|X){4}-(\d|X){4}-(\d|X){4}-(\d|X){4})/i);
  return {
    application: application || '',
    biography: biography || '',
    degree: ['BA', 'BSc', 'MSc', 'PhD', 'MD', 'PhD, MD'].includes(degree || '')
      ? (degree as Degree)
      : undefined,
    email: email || '',
    firstName: firstName || '',
    institution: institution || '',
    jobTitle: jobTitle || '',
    lastName: lastName || '',
    orcid: (orcid && orcid[0]) || '',
    projectTitle: projectTitle || '',
    questions: [question1, question2, question3, question4].filter(
      Boolean,
    ) as string[],
    researchInterest: researchInterest || '',
    responsibilities: responsibilities || '',
    role: role as TeamRole,
    skills: skills
      ? skills
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
      : [],
    skillsDescription: skillsDescription || '',
    asapRole: ['Staff', 'Grantee', 'Guest'].includes(asapRole || '')
      ? (asapRole as Role)
      : 'Guest',
    social: {
      website1: website1 || undefined,
      website2: website2 || undefined,
      linkedIn: linkedIn ? new URL(linkedIn).pathname.split('/')[2] : undefined,
      researcherId: researcherID
        ? new URL(researcherID).pathname.split('/')[2]
        : undefined,
      twitter: twitter ? twitter.slice(1) : undefined,
      github: gitHub ? new URL(gitHub).pathname.split('/')[1] : undefined,
      googleScholar: googleScholar
        ? new URL(googleScholar).searchParams.get('key') || undefined
        : undefined,
      researchGate: researchGate
        ? new URL(researchGate).pathname.split('/')[2]
        : undefined,
    },
  };
};

import { caseInsensitive, CSVValue } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { formatDate } from '@asap-hub/react-components';
import { Stringifier } from 'csv-stringify/browser/esm';

export const userFields = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  region: 'Region',
  location: 'Location',
  stateOrProvince: 'State/Province',
  city: 'City',
  role: 'GP2 role',
  degrees: 'Degrees',
  onboarded: 'Onboarded',
  primaryInstitution: 'Institution',
  primaryDepartment: 'Department',
  primaryRole: 'Role',
  secondaryInstitution: 'Institution',
  secondaryDepartment: 'Department',
  secondaryRole: 'Role',
  tertiaryInstitution: 'Institution',
  tertiaryDepartment: 'Department',
  tertiaryRole: 'Role',
  tags: 'Tags',
  biography: 'Biography',
  projects: 'Projects',
  workingGroups: 'Working groups',
  questions: 'Open questions',
  fundingStreams: 'Financial disclosures',
  contributingCohorts: 'Contributing cohorts',
  googleScholar: 'Google Scholar',
  orcid: 'ORCID',
  blog: 'Blog',
  twitter: 'Twitter',
  linkedIn: 'LinkedIn',
  github: 'GitHub',
  createdDate: 'Account Created',
  activatedDate: 'Account activated',
};

export type UserCSV = Record<keyof typeof userFields, CSVValue>;

export const MAX_RESULTS = 10;

const sorted = (items?: string[]) => items?.sort(caseInsensitive).join(',\n');
export const userToCSV = ({
  firstName,
  lastName,
  email,
  region,
  country,
  city,
  stateOrProvince,
  role,
  degrees,
  onboarded,
  positions,
  projects,
  workingGroups,
  fundingStreams,
  contributingCohorts,
  createdDate,
  activatedDate,
  social: { googleScholar, orcid, blog, twitter, linkedIn, github } = {},
  biography,
  tags,
  questions,
}: gp2.UserResponse): UserCSV => ({
  firstName,
  lastName,
  email,
  region,
  location: city ? `${country}, ${city}` : country,
  stateOrProvince,
  city,
  role,
  degrees: sorted(degrees),
  onboarded: onboarded ? 'Yes' : 'No',
  primaryDepartment: positions?.[0]?.department,
  primaryInstitution: positions?.[0]?.institution,
  primaryRole: positions?.[0]?.role,
  secondaryDepartment: positions?.[1]?.department,
  secondaryInstitution: positions?.[1]?.institution,
  secondaryRole: positions?.[1]?.role,
  tertiaryDepartment: positions?.[2]?.department,
  tertiaryInstitution: positions?.[2]?.institution,
  tertiaryRole: positions?.[2]?.role,
  biography,
  tags: sorted(tags.map(({ name }) => name)),
  projects: sorted(projects.map(({ title }) => title)),
  workingGroups: sorted(workingGroups.map(({ title }) => title)),
  questions: questions.join(',\n'),
  fundingStreams,
  contributingCohorts: sorted(
    contributingCohorts.map(({ name, role: cohortRole, studyUrl }) => {
      const required = `${name} ${cohortRole}`;
      return studyUrl ? `${required} ${studyUrl}` : required;
    }),
  ),
  googleScholar,
  orcid,
  blog,
  twitter,
  linkedIn,
  github,
  createdDate: formatDate(new Date(createdDate)),
  activatedDate: activatedDate && formatDate(new Date(activatedDate)),
});

export const usersResponseToStream = async (
  csvStream: Stringifier,
  getResults: ({
    take,
    skip,
  }: Pick<gp2.FetchUsersOptions, 'take' | 'skip'>) => Readonly<
    Promise<gp2.ListUserResponse>
  >,
  transform: (result: gp2.UserResponse) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      skip: currentPage * MAX_RESULTS,
      take: MAX_RESULTS,
    });
    data.items.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage * MAX_RESULTS < data.total;
  }
  csvStream.end();
};

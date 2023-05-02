import { caseInsensitive, CSVValue } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { formatDate } from '@asap-hub/react-components';
/* eslint-disable-next-line import/no-unresolved */
import { Stringifier } from 'csv-stringify/browser/esm';

export const userFields = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  region: 'Region',
  location: 'Location',
  role: 'GP2 role',
  degrees: 'Degrees',
  onboarded: 'Onboarded',
  primaryPosition: 'Primary position',
  secondaryPosition: 'Secondary position',
  tertiaryPosition: 'Tertiary position',
  keywords: 'Keywords',
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

type UserCSV = Record<keyof typeof userFields, CSVValue>;

export const MAX_SQUIDEX_RESULTS = 200;

const getPositionString = (position?: gp2.UserPosition) =>
  position
    ? `${position.role} in ${position.department} at ${position.institution}`
    : undefined;
const sorted = (items?: string[]) => items?.sort(caseInsensitive).join(',\n');
export const userToCSV = ({
  firstName,
  lastName,
  email,
  region,
  country,
  city,
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
  keywords,
  questions,
}: gp2.UserResponse): UserCSV => ({
  firstName,
  lastName,
  email,
  region,
  location: city ? `${country}, ${city}` : country,
  role,
  degrees: sorted(degrees),
  onboarded: onboarded ? 'Yes' : 'No',
  primaryPosition: getPositionString(positions[0]),
  secondaryPosition: getPositionString(positions[1]),
  tertiaryPosition: getPositionString(positions[2]),
  biography,
  keywords: sorted(keywords),
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

export const squidexUsersResponseToStream = async (
  csvStream: Stringifier,
  getResults: ({
    take,
    skip,
  }: Pick<gp2.FetchUsersOptions, 'take' | 'skip'>) => Readonly<
    Promise<gp2.ListUserResponse>
  >,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  transform: (result: gp2.UserResponse) => Record<string, any>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      skip: currentPage * MAX_SQUIDEX_RESULTS,
      take: MAX_SQUIDEX_RESULTS,
    });
    data.items.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage * MAX_SQUIDEX_RESULTS < data.total;
  }
  csvStream.end();
};

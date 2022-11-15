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
  terciaryPosition: 'Terciary position',
  projects: 'Projects',
  workingGroups: 'Working groups',
  fundingStreams: 'Funding streams',
  contributingCohorts: 'Contributing cohorts',
  createdDate: 'Ativated account',
};

type UserCSV = Record<keyof typeof userFields, CSVValue>;

export const MAX_SQUIDEX_RESULTS = 200;

export const userToCSV = (output: gp2.UserResponse): UserCSV => ({
  firstName: output.firstName,
  lastName: output.lastName,
  email: output.email,
  region: output.region,
  location: `${output.country}${output.city ? ', ' : ''}${output.city || ''}`,
  role: output.role,
  degrees: output.degrees?.sort(caseInsensitive).join(',\n'),
  onboarded: output.onboarded ? 'Yes' : 'No',
  primaryPosition: output.positions[0]
    ? `${output.positions[0].role} in ${output.positions[0].department} at ${output.positions[0].institution}`
    : undefined,
  secondaryPosition: output.positions[1]
    ? `${output.positions[1].role} in ${output.positions[1].department} at ${output.positions[1].institution}`
    : undefined,
  terciaryPosition: output.positions[2]
    ? `${output.positions[2].role} in ${output.positions[2].department} at ${output.positions[2].institution}`
    : undefined,
  projects: output.projects
    .map(({ title }) => title)
    .sort(caseInsensitive)
    .join(',\n'),
  workingGroups: output.workingGroups
    .map(({ title }) => title)
    .sort(caseInsensitive)
    .join(',\n'),
  fundingStreams: output.fundingStreams as string,
  contributingCohorts: output.contributingCohorts
    .map((value) => value as string)
    .sort(caseInsensitive)
    .join(', '),
  createdDate: formatDate(new Date(output.createdDate)),
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
  csvStream.write(userFields);
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

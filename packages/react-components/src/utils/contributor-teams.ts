const BIG_SPACE = ' ';

const withContributorBullets = (
  message: string,
  labels: ReadonlyArray<string>,
): string =>
  `${message}\n${labels
    .map((label) => `${BIG_SPACE}•${BIG_SPACE}${label}`)
    .join('\n')}`;

const getContributorTeamIds = (author: unknown): string[] => {
  const teams = (
    author as { teams?: ReadonlyArray<{ id: string }> } | null | undefined
  )?.teams;
  return Array.isArray(teams) ? teams.map(({ id }) => id) : [];
};

export const getAuthorsMissingTeam = <
  T extends { label: string; author?: unknown },
>(
  authors: ReadonlyArray<T>,
  selectedTeamIds: ReadonlyArray<string>,
): T[] =>
  authors.filter((option) => {
    const authorTeamIds = getContributorTeamIds(option.author);
    return (
      authorTeamIds.length > 0 &&
      authorTeamIds.every((teamId) => !selectedTeamIds.includes(teamId))
    );
  });

export const getAuthorsNotProjectMembers = <T extends { value: string }>(
  authors: ReadonlyArray<T>,
  memberIds: ReadonlyArray<string>,
): T[] => authors.filter(({ value }) => !memberIds.includes(value));

export const getLabsMissingPITeam = <
  T extends { label: string; labPITeamIds?: ReadonlyArray<string> },
>(
  labs: ReadonlyArray<T>,
  selectedTeamIds: ReadonlyArray<string>,
): T[] =>
  labs.filter((lab) => {
    const labPITeamIds = lab.labPITeamIds ?? [];
    return (
      labPITeamIds.length > 0 &&
      labPITeamIds.every((teamId) => !selectedTeamIds.includes(teamId))
    );
  });

export const missingTeamAuthorsMessage = (
  role: string,
  labels: ReadonlyArray<string>,
): string =>
  withContributorBullets(
    `The following ${role} do not have a team listed as a contributor. Please add at least one of their teams, or contact support if they don’t belong to any.`,
    labels,
  );

export const nonProjectMemberAuthorsMessage = (
  role: string,
  labels: ReadonlyArray<string>,
): string =>
  withContributorBullets(
    `The following ${role} are not members of this project. Only project members can be authors, so please contact support to add them, or remove them from the list.`,
    labels,
  );

export const missingPITeamLabsMessage = (
  labels: ReadonlyArray<string>,
): string =>
  withContributorBullets(
    'The following lab(s) do not list their corresponding PI’s team as a contributor. Please add at least one of their teams to the Teams field.',
    labels,
  );

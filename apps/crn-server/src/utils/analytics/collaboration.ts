import { FetchUserCollaborationQuery } from '@asap-hub/contentful';
import { TeamRole, UserCollaborationDataObject } from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';

export type EntityWithId = {
  sys: {
    id: string;
  };
};

export type Author = {
  id: string;
  teams: EntityWithId[];
  labs: EntityWithId[];
};

export const checkDifferentTeams = (
  referenceTeams: EntityWithId[],
  testTeams: EntityWithId[],
): boolean =>
  referenceTeams.every((referenceTeam) =>
    testTeams.every((testTeam) => testTeam.sys.id !== referenceTeam.sys.id),
  );

export const checkSameTeamDifferentLab = (
  referenceTeam: EntityWithId,
  referenceLabs: EntityWithId[],
  testUser: Author,
): boolean => {
  const sameTeam = testUser.teams.find(
    (testTeam) => testTeam.sys.id === referenceTeam.sys.id,
  );
  if (sameTeam) {
    return referenceLabs
      .map((lab) =>
        testUser.labs.find((testLab) => testLab.sys.id === lab.sys.id),
      )
      .every((value) => !value);
  }
  return false;
};

export const findMatchingAuthors = ({
  referenceId,
  referenceTeams,
  referenceTeam,
  referenceLabs,
  authorList,
}: {
  referenceId: string;
  referenceTeam: EntityWithId;
  referenceTeams: EntityWithId[];
  referenceLabs: EntityWithId[];
  authorList: Author[];
}) => {
  let [differentTeamFlag, sameTeamDifferentLabFlag] = [false, false];
  let isAuthor = false;
  authorList.forEach((author) => {
    if (author && author.id !== referenceId) {
      if (
        !differentTeamFlag &&
        checkDifferentTeams(referenceTeams, author.teams)
      ) {
        differentTeamFlag = true;
      }
      if (
        !sameTeamDifferentLabFlag &&
        checkSameTeamDifferentLab(referenceTeam, referenceLabs, author)
      ) {
        sameTeamDifferentLabFlag = true;
      }
    } else if (author.id === referenceId) {
      isAuthor = true;
    }
  });
  if (isAuthor) {
    return { differentTeamFlag, sameTeamDifferentLabFlag };
  }
  // don't count output if not the author
  return { differentTeamFlag: false, sameTeamDifferentLabFlag: false };
};

export const getCollaborationCounts = (
  data: {
    differentTeamFlag: boolean;
    sameTeamDifferentLabFlag: boolean;
  }[],
) =>
  data.reduce(
    (
      { acrossTeamCount, withinTeamCount },
      { differentTeamFlag, sameTeamDifferentLabFlag },
    ) => ({
      acrossTeamCount: differentTeamFlag
        ? acrossTeamCount + 1
        : acrossTeamCount,
      withinTeamCount: sameTeamDifferentLabFlag
        ? withinTeamCount + 1
        : withinTeamCount,
    }),
    {
      acrossTeamCount: 0,
      withinTeamCount: 0,
    },
  );

export const getUserCollaborationItems = (
  userCollection: FetchUserCollaborationQuery['usersCollection'],
): UserCollaborationDataObject[] =>
  cleanArray(userCollection?.items).map((user) => {
    const teams = cleanArray(user?.teamsCollection?.items).map((team) => {
      const analyticData =
        user.linkedFrom?.researchOutputsCollection?.items.map((output) => {
          const authorList = cleanArray(
            cleanArray(output?.authorsCollection?.items).map((author) => {
              if (author.__typename === 'Users') {
                return {
                  id: author.sys.id,
                  teams: cleanArray(author.teamsCollection?.items).map(
                    (item) => item.team || { sys: { id: '' } },
                  ),
                  labs: cleanArray(author.labsCollection?.items),
                };
              }
              return null;
            }),
          );
          return findMatchingAuthors({
            referenceId: user.sys.id,
            referenceTeam: team.team ? team.team : { sys: { id: '' } },
            referenceTeams: cleanArray(user?.teamsCollection?.items).map(
              (item) => item.team || { sys: { id: '' } },
            ),
            referenceLabs: cleanArray(user.labsCollection?.items),
            authorList,
          });
        });
      const { acrossTeamCount, withinTeamCount } = getCollaborationCounts(
        cleanArray(analyticData),
      );

      return {
        team: team.team?.displayName ?? '',
        role: (team.role as TeamRole) ?? undefined,
        isTeamInactive: !!team.inactiveSinceDate,
        outputsCoAuthoredAcrossTeams: acrossTeamCount,
        outputsCoAuthoredWithinTeam: withinTeamCount,
      };
    });

    return {
      id: user.sys.id,
      name: parseUserDisplayName(
        user.firstName ?? '',
        user.lastName ?? '',
        undefined,
        user.nickname ?? '',
      ),
      isAlumni: !!user.alumniSinceDate,
      teams,
    };
  });

import { FetchUserCoproductionQuery } from '@asap-hub/contentful';
import {
  cleanArray,
  parseUserDisplayName,
} from '@asap-hub/server-common';

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
  referenceTeam: EntityWithId,
  testTeams: EntityWithId[],
): boolean =>
  !testTeams.find((testTeam) => testTeam.sys.id === referenceTeam.sys.id);

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
  referenceTeam,
  referenceLabs,
  authorList,
}: {
  referenceId: string;
  referenceTeam: EntityWithId;
  referenceLabs: EntityWithId[];
  authorList: Author[];
}) => {
  let [differentTeamFlag, sameTeamDifferentLabFlag] = [false, false];
  for (let i = 0; i < authorList.length; i++) {
    const author = authorList[i];
    if (author) {
      if (author.id === referenceId) {
        continue;
      }
      if (
        !differentTeamFlag &&
        checkDifferentTeams(referenceTeam, author.teams)
      ) {
        differentTeamFlag = true;
      }
      if (
        !sameTeamDifferentLabFlag &&
        checkSameTeamDifferentLab(referenceTeam, referenceLabs, author)
      ) {
        sameTeamDifferentLabFlag = true;
      }
    }
  }
  return { differentTeamFlag, sameTeamDifferentLabFlag };
};
export const getCollaborationCounts = (
  data: {
    differentTeamFlag: boolean;
    sameTeamDifferentLabFlag: boolean;
  }[],
) => {
  return data.reduce(
    (
      { acrossTeamCount, withinTeamCount },
      { differentTeamFlag, sameTeamDifferentLabFlag },
    ) => {
      return {
        acrossTeamCount: differentTeamFlag
          ? acrossTeamCount + 1
          : acrossTeamCount,
        withinTeamCount: sameTeamDifferentLabFlag
          ? withinTeamCount + 1
          : withinTeamCount,
      };
    },
    {
      acrossTeamCount: 0,
      withinTeamCount: 0,
    },
  );
};

export const getUserCoproductionItems = (
  userCollection: FetchUserCoproductionQuery['usersCollection'],
) => {
  return cleanArray(userCollection?.items).map((user) => {
    const teams = cleanArray(user?.teamsCollection?.items).map((team) => {
      const analyticData =
        user.linkedFrom?.researchOutputsCollection?.items.map((output) => {
          const authorList = cleanArray(
            cleanArray(output?.authorsCollection?.items).map((author) => {
              if (author.__typename === 'Users') {
                return {
                  id: author.sys.id,
                  teams: cleanArray(author.teamsCollection?.items),
                  labs: cleanArray(author.labsCollection?.items),
                };
              }
              return null;
            }),
          );
          return findMatchingAuthors({
            referenceId: user.sys.id,
            referenceTeam: team.team ? team.team : { sys: { id: '' } },
            referenceLabs: cleanArray(user.labsCollection?.items),
            authorList,
          });
        });
      const { acrossTeamCount, withinTeamCount } = getCollaborationCounts(
        cleanArray(analyticData),
      );

      return {
        name: team.team?.displayName ?? '',
        role: team.role ?? '',
        isInactive: !!team.inactiveSinceDate,
        acrossTeamCount,
        withinTeamCount,
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
};

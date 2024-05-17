import {
  FetchTeamCollaborationQuery,
  FetchUserCollaborationQuery,
} from '@asap-hub/contentful';
import {
  TeamCollaborationAcrossOutputData,
  TeamCollaborationDataObject,
  TeamCollaborationWithinOutputData,
  TeamOutputDocumentType,
  teamOutputDocumentTypes,
  TeamRole,
  TimeRangeOption,
  UserCollaborationDataObject,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';
import { getFilterOutputByRange } from './common';

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

export const isTeamOutputDocumentType = (
  documentType: string,
): documentType is TeamOutputDocumentType =>
  teamOutputDocumentTypes.includes(documentType as TeamOutputDocumentType);

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

const getTeamCollaborationAcrossData = (
  outputs: {
    hasMultipleTeams: boolean;
    documentType: TeamOutputDocumentType;
    teams: Team[];
  }[],
): TeamCollaborationAcrossOutputData => {
  const seenCollaborationTeams: string[] = [];
  return outputs.reduce(
    (acc, outputData) => {
      cleanArray(outputData.teams).forEach((team) => {
        const teamId = team?.sys.id;
        if (seenCollaborationTeams.includes(teamId)) {
          const teamData = acc.byTeam.find(
            (outputTeam) => outputTeam.id === teamId,
          ) as TeamCollaborationAcrossOutputData['byTeam'][number];
          teamData[outputData.documentType] += 1;
        } else {
          acc.byTeam.push({
            id: teamId,
            name: team.displayName ?? '',
            isInactive: !!team.inactiveSince,
            Article: 0,
            Bioinformatics: 0,
            Dataset: 0,
            'Lab Resource': 0,
            Protocol: 0,
            [outputData.documentType]: 1,
          });
          seenCollaborationTeams.push(teamId);
        }
      });
      return {
        ...acc,
        byDocumentType: {
          ...acc.byDocumentType,
          [outputData.documentType]:
            acc.byDocumentType[outputData.documentType] + 1,
        },
      };
    },
    {
      byDocumentType: {
        Article: 0,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 0,
      },
      byTeam: [] as TeamCollaborationAcrossOutputData['byTeam'],
    },
  );
};

const getTeamCollaborationWithinData = (
  outputs: {
    documentType: TeamOutputDocumentType;
  }[],
): TeamCollaborationWithinOutputData =>
  outputs.reduce(
    (acc, outputData) => ({
      ...acc,
      [outputData.documentType]: acc[outputData.documentType] + 1,
    }),
    {
      Article: 0,
      Bioinformatics: 0,
      Dataset: 0,
      'Lab Resource': 0,
      Protocol: 0,
    },
  );

export const getTeamCollaborationItems = (
  teamCollection: FetchTeamCollaborationQuery['teamsCollection'],
  rangeKey?: TimeRangeOption,
): TeamCollaborationDataObject[] =>
  cleanArray(teamCollection?.items).map((team) => {
    const outputsData = team.linkedFrom?.researchOutputsCollection?.items
      .filter(getFilterOutputByRange(rangeKey))
      .filter(
        (output) =>
          output?.documentType && isTeamOutputDocumentType(output.documentType),
      )
      .map((output) => {
        const data = {
          hasMultipleTeams: false,
          hasMultipleLabs: false,
          documentType: output?.documentType as TeamOutputDocumentType,
          teams: [] as Team[],
        };
        const contributingTeams = cleanArray(output?.teamsCollection?.items);
        if (contributingTeams.length > 1) {
          data.hasMultipleTeams = true;
          data.teams = contributingTeams.filter(
            (currentTeam) => currentTeam.sys.id !== team.sys.id,
          );
        }
        if ((output?.labsCollection?.total || 0) > 1) {
          data.hasMultipleLabs = true;
        }
        return data;
      });

    const outputsCoProducedAcross = getTeamCollaborationAcrossData(
      cleanArray(outputsData?.filter((output) => output.hasMultipleTeams)),
    );
    const outputsCoProducedWithin = getTeamCollaborationWithinData(
      cleanArray(outputsData?.filter((output) => output.hasMultipleLabs)),
    );

    return {
      id: team.sys.id,
      name: team.displayName ?? '',
      isInactive: !!team.inactiveSince,
      outputsCoProducedAcross,
      outputsCoProducedWithin,
    };
  });

type Team = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<
            FetchTeamCollaborationQuery['teamsCollection']
          >['items'][number]
        >['linkedFrom']
      >['researchOutputsCollection']
    >['items'][number]
  >['teamsCollection']
>['items'][number];

import {
  OrcidWork,
  orcidWorkType,
  OrcidWorkType,
  UserAward,
} from '@asap-hub/model';
import { cleanArray } from '@asap-hub/server-common';

export const isOrcidWorkType = (data: string): data is OrcidWorkType =>
  (orcidWorkType as ReadonlyArray<string>).includes(data);

// Minimal awardsCollection shape shared by the three team-membership query
// results (detail, list, algolia). Declared locally so the one parser can
// accept all three without coupling to a single codegen query type.
export type TeamMembershipWithAwards = {
  awardsCollection?: {
    items: ({
      date?: string | null;
      awardType?: {
        name?: string | null;
        icon?: { url?: string | null } | null;
        smallIcon?: { url?: string | null } | null;
      } | null;
    } | null)[];
  } | null;
};

export const getOrcidWorkPublicationDate = (input: {
  day?: string;
  month?: string;
  year?: string;
}): OrcidWork['publicationDate'] => {
  const date: OrcidWork['publicationDate'] = {};

  if (typeof input.day === 'string') {
    date.day = input.day;
  }

  if (typeof input.month === 'string') {
    date.month = input.month;
  }

  if (typeof input.year === 'string') {
    date.year = input.year;
  }

  return date;
};

export type OrcidWorkCMS = {
  id: string;
  doi?: string;
  title?: string;
  type?: string;
  publicationDate?: {
    day?: string;
    month?: string;
    year?: string;
  };
  lastModifiedDate?: string;
};

export const parseOrcidWorkFromCMS = (orcidWork: OrcidWorkCMS): OrcidWork => ({
  id: orcidWork.id,
  doi: orcidWork.doi || undefined,
  title: orcidWork.title || undefined,
  type:
    orcidWork.type && isOrcidWorkType(orcidWork.type)
      ? orcidWork.type
      : 'UNDEFINED',
  publicationDate:
    (orcidWork.publicationDate &&
      getOrcidWorkPublicationDate(orcidWork.publicationDate)) ||
    {},
  lastModifiedDate: orcidWork.lastModifiedDate || '',
});

export const parseAwardsCollection = (
  team: TeamMembershipWithAwards,
): UserAward[] =>
  cleanArray(team.awardsCollection?.items).reduce(
    (awards: UserAward[], award): UserAward[] => {
      const name = award.awardType?.name;
      if (!name || !award.date) {
        return awards;
      }
      return [
        ...awards,
        {
          name,
          date: award.date,
          iconUrl: award.awardType?.icon?.url ?? undefined,
          smallIconUrl: award.awardType?.smallIcon?.url ?? undefined,
        },
      ];
    },
    [],
  );

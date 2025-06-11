import {
  addLocaleToFields,
  Environment,
  FetchPublicTeamsQuery,
  FetchPublicTeamsQueryVariables,
  FetchTeamByIdQuery,
  FetchTeamByIdQueryVariables,
  FetchTeamsQuery,
  FetchTeamsQueryVariables,
  FETCH_PUBLIC_TEAMS,
  FETCH_TEAMS,
  FETCH_TEAM_BY_ID,
  GraphQLClient,
  patchAndPublish,
  TeamsOrder,
} from '@asap-hub/contentful';
import {
  FetchPaginationOptions,
  LabResponse,
  ListPublicTeamDataObject,
  ListTeamDataObject,
  manuscriptMapStatus,
  PublicTeamListItemDataObject,
  TeamDataObject,
  TeamLeader,
  TeamListItemDataObject,
  TeamMember,
  TeamRole,
  TeamSupplementGrant,
  TeamTool,
  TeamUpdateDataObject,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';
import { DateTime } from 'luxon';

import { sortMembers } from '../transformers';
import {
  FetchTeamsOptions,
  TeamDataProvider,
} from '../types/teams.data-provider.types';
import { parseGraphqlManuscriptVersion } from './manuscript.data-provider';
import { parseResearchTags } from './research-tag.data-provider';

export type TeamByIdItem = NonNullable<
  NonNullable<FetchTeamByIdQuery['teams']>
>;

export type MembershipTeamById = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FetchTeamByIdQuery['teams']>['linkedFrom']
    >['teamMembershipCollection']
  >['items'][number]
>;

export type TeamItem = NonNullable<
  NonNullable<FetchTeamsQuery['teamsCollection']>['items'][number]
>;

type PublicTeamItem = NonNullable<
  NonNullable<FetchPublicTeamsQuery['teamsCollection']>['items'][number]
>;

type PublicTeamMembership = NonNullable<
  NonNullable<
    NonNullable<PublicTeamItem['linkedFrom']>['teamMembershipCollection']
  >['items'][number]
>;

type TeamInterestGroupItem = NonNullable<
  NonNullable<
    NonNullable<PublicTeamItem['linkedFrom']>['interestGroupsCollection']
  >['items'][number]
>;

export type Membership = NonNullable<
  NonNullable<
    NonNullable<TeamItem['linkedFrom']>['teamMembershipCollection']
  >['items'][number]
>;

export type ManuscriptItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FetchTeamByIdQuery['teams']>['linkedFrom']
    >['manuscriptsCollection']
  >['items'][number]
>;

export class TeamContentfulDataProvider implements TeamDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}
  async create(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async fetch(options: FetchTeamsOptions): Promise<ListTeamDataObject> {
    const { take = 8, skip = 0, search, filter } = options;

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const searchQuery = searchTerms.length
      ? {
          OR: [
            ...searchTerms.map((term) => ({
              displayName_contains: term,
            })),
            ...searchTerms.map((term) => ({
              projectTitle_contains: term,
            })),
            ...searchTerms.map((term) => ({
              researchTags: { name_contains: term },
            })),
          ],
        }
      : {};

    const activeQuery =
      typeof filter?.active === 'boolean'
        ? { inactiveSince_exists: !filter?.active }
        : {};

    const { teamsCollection } = await this.contentfulClient.request<
      FetchTeamsQuery,
      FetchTeamsQueryVariables
    >(FETCH_TEAMS, {
      limit: take,
      skip,
      order: [TeamsOrder.DisplayNameAsc],
      where: {
        ...searchQuery,
        ...activeQuery,
      },
    });

    if (!teamsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: teamsCollection?.total,
      items: teamsCollection?.items
        .filter((x): x is TeamItem => x !== null)
        .map(parseContentfulGraphQlTeamListItem),
    };
  }

  async fetchPublicTeams(
    options: FetchPaginationOptions,
  ): Promise<ListPublicTeamDataObject> {
    const { take = 8, skip = 0 } = options;

    const { teamsCollection } = await this.contentfulClient.request<
      FetchPublicTeamsQuery,
      FetchPublicTeamsQueryVariables
    >(FETCH_PUBLIC_TEAMS, {
      limit: take,
      skip,
      order: [TeamsOrder.DisplayNameAsc],
    });

    if (!teamsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: teamsCollection?.total,
      items: teamsCollection?.items
        .filter((x): x is PublicTeamItem => x !== null)
        .map(parseContentfulGraphQlPublicTeamListItem),
    };
  }

  async fetchById(
    id: string,
    internalAPI: boolean = true,
  ): Promise<TeamDataObject | null> {
    const { teams } = await this.contentfulClient.request<
      FetchTeamByIdQuery,
      FetchTeamByIdQueryVariables
    >(FETCH_TEAM_BY_ID, { id, internalAPI });

    if (!teams) {
      return null;
    }

    return parseContentfulGraphQlTeam(teams);
  }

  async update(id: string, update: TeamUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();

    const cleanTools = getCleanTools(update.tools);

    const publishedTools = await createAndPublishTools(environment, cleanTools);

    const team = await environment.getEntry(id);

    const previousToolsLinks = team.fields.tools
      ? team.fields.tools['en-US']
      : [];

    const newToolsLinks = publishedTools.map((tool) => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: tool.sys.id,
      },
    }));

    await patchAndPublish(team, {
      tools: [...previousToolsLinks, ...newToolsLinks],
    });
  }
}

export const parseContentfulGraphQlTeamListItem = (
  item: TeamItem,
): TeamListItemDataObject => {
  const [numberOfMembers, labIds]: [number, Set<string>] = (
    item.linkedFrom?.teamMembershipCollection?.items || []
  ).reduce(
    ([memberCount, labIdsSet], membership: Membership | null) => {
      if (
        !membership ||
        !membership.linkedFrom?.usersCollection?.items[0]?.onboarded ||
        !membership.role
      ) {
        return [memberCount, labIdsSet];
      }

      const { labsCollection } =
        membership.linkedFrom?.usersCollection?.items[0] || {};

      const memberLabIds = labsCollection?.items
        .map((labItem) => labItem?.sys.id)
        .filter((x): x is string => x !== undefined);

      memberLabIds?.forEach((labId) => labIdsSet.add(labId));

      return [memberCount + 1, labIdsSet];
    },
    [0, new Set() as Set<string>],
  );

  return {
    id: item.sys.id ?? '',
    displayName: item.displayName ?? '',
    inactiveSince: item.inactiveSince ?? undefined,
    projectTitle: item.projectTitle ?? '',
    tags: parseResearchTags(item.researchTagsCollection?.items || []),
    memberCount: numberOfMembers,
    labCount: labIds.size,
  };
};

export const parseContentfulGraphQlPublicTeamListItem = (
  item: PublicTeamItem,
): PublicTeamListItemDataObject => {
  const [activeMembers, inactiveMembers, teamLeaders]: [
    Set<string>,
    Set<string>,
    Set<TeamLeader>,
  ] = (item.linkedFrom?.teamMembershipCollection?.items || []).reduce(
    (
      [activeIdsSet, inactiveIdsSet, leadersSet],
      membership: PublicTeamMembership | null,
    ) => {
      if (
        !membership ||
        !membership.linkedFrom?.usersCollection?.items[0]?.onboarded ||
        !membership.role
      ) {
        return [activeIdsSet, inactiveIdsSet, leadersSet];
      }

      const member = membership.linkedFrom.usersCollection.items[0];
      if (membership.inactiveSinceDate || member.alumniSinceDate) {
        inactiveIdsSet.add(member.sys.id);
      } else {
        activeIdsSet.add(member.sys.id);
        if (
          membership.role === 'Project Manager' ||
          membership.role === 'Lead PI (Core Leadership)'
        ) {
          leadersSet.add({
            id: member.sys.id,
            displayName: parseUserDisplayName(
              member.firstName ?? '',
              member.lastName ?? '',
              undefined,
              member.nickname ?? '',
            ),
            avatarUrl: member.avatar?.url,
          } as TeamLeader);
        }
      }

      return [activeIdsSet, inactiveIdsSet, leadersSet];
    },
    [
      new Set() as Set<string>,
      new Set() as Set<string>,
      new Set() as Set<TeamLeader>,
    ],
  );

  const activeInterestGroups = cleanArray(
    item.linkedFrom?.interestGroupsCollection?.items,
  )
    .filter((ig): ig is TeamInterestGroupItem => !!ig.active)
    .map((ig) => ig.name || '');

  const isInactiveTeam = !!item.inactiveSince;

  const membershipData = isInactiveTeam
    ? {
        activeTeamMembers: [],
        noOfTeamMembers: 0,
        inactiveTeamMembers: [
          ...new Set([...activeMembers, ...inactiveMembers]),
        ],
      }
    : {
        activeTeamMembers: [...activeMembers],
        noOfTeamMembers: activeMembers.size,
        inactiveTeamMembers: [...inactiveMembers],
      };

  return {
    id: item.sys.id ?? '',
    name: item.displayName ?? '',
    researchTheme: item.researchTheme?.name ?? undefined,
    teamLeaders: [...teamLeaders],
    activeInterestGroups,
    ...membershipData,
  };
};

const mapManuscripts = (
  manuscript: ManuscriptItem,
): TeamDataObject['manuscripts'][number] => {
  const teamId = manuscript.teamsCollection?.items[0]?.teamId || '';
  const grantId = manuscript.teamsCollection?.items[0]?.grantId || '';
  const count = manuscript.count || 1;

  return {
    id: manuscript.sys.id,
    count,
    title: manuscript.title || '',
    url: manuscript.url || undefined,
    teamId,
    grantId,
    status: manuscriptMapStatus(manuscript.status) || undefined,
    versions: parseGraphqlManuscriptVersion(
      manuscript.versionsCollection?.items || [],
      grantId,
      teamId,
      count,
    ),
  };
};

export const parseContentfulGraphQlTeam = (
  item: TeamByIdItem,
): TeamDataObject => {
  const teamId = item.sys.id;
  const tools = (item.toolsCollection?.items || []).reduce(
    (teamTools: TeamTool[], tool) => {
      if (!tool || !tool.name || !tool.url) {
        return teamTools;
      }

      const { name, url, description } = tool;

      return [
        ...teamTools,
        {
          name,
          url,
          description: description ?? undefined,
        },
      ];
    },
    [],
  );

  const members: TeamMember[] = (
    item.linkedFrom?.teamMembershipCollection?.items || []
  ).reduce(
    (
      userList: TeamMember[],
      membership: MembershipTeamById | null,
    ): TeamMember[] => {
      if (
        !membership ||
        !membership.linkedFrom?.usersCollection?.items[0]?.onboarded ||
        !membership.role
      ) {
        return userList;
      }

      const { role, inactiveSinceDate } = membership;
      const {
        sys: { id },
        firstName,
        nickname,
        lastName,
        email,
        avatar,
        labsCollection,
        alumniSinceDate,
      } = membership.linkedFrom?.usersCollection?.items[0] || {};

      const labs: LabResponse[] = (labsCollection?.items || []).reduce(
        (userLabs: LabResponse[], lab): LabResponse[] => {
          if (!lab) {
            return userLabs;
          }

          return [
            ...userLabs,
            {
              id: lab.sys.id,
              name: lab.name || '',
            },
          ];
        },
        [],
      );

      return [
        ...userList,
        {
          id,
          firstName: firstName ?? '',
          lastName: lastName ?? '',
          email: email ?? '',
          role: (role as TeamRole) ?? '',
          inactiveSinceDate: inactiveSinceDate ?? undefined,
          alumniSinceDate,
          avatarUrl: avatar?.url ?? undefined,
          displayName: parseUserDisplayName(
            firstName ?? '',
            lastName ?? '',
            undefined,
            nickname ?? '',
          ),
          labs,
        },
      ];
    },
    [],
  );

  const labCount = members
    .flatMap((member) => member.labs || [])
    .filter(
      (lab, index, labs) => labs.findIndex((l) => l.id === lab.id) === index,
    ).length;

  const getSupplementGrant = (): TeamSupplementGrant | undefined => {
    if (!item.supplementGrant) return undefined;

    const { title, description, proposal, startDate, endDate } =
      item.supplementGrant;

    const hasGrantStarted = DateTime.now() >= DateTime.fromISO(startDate);

    if (!hasGrantStarted) return undefined;

    return {
      title: title ?? '',
      description: description ?? '',
      proposalURL: proposal ? proposal.sys.id : undefined,
      startDate,
      endDate,
    };
  };

  const sortManuscripts = (manuscripts: ManuscriptItem[]) => {
    const STATUS_PRIORITY: Record<'Compliant' | 'Closed (other)', number> = {
      Compliant: 1,
      'Closed (other)': 2,
    };

    return [...manuscripts].sort((a, b) => {
      const aPriority =
        STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY] ?? 0;
      const bPriority =
        STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY] ?? 0;
      return aPriority - bPriority;
    });
  };

  const parseManuscripts = () => {
    const manuscripts = cleanArray(
      item.linkedFrom?.manuscriptsCollection?.items,
    );

    const teamManuscripts = manuscripts.filter(
      (manuscript) => manuscript.teamsCollection?.items[0]?.sys.id === teamId,
    );

    const collaborationManuscripts = manuscripts.filter(
      (manuscript) => manuscript.teamsCollection?.items[0]?.sys.id !== teamId,
    );

    return {
      manuscripts: sortManuscripts(teamManuscripts).map(mapManuscripts),
      collaborationManuscripts: sortManuscripts(collaborationManuscripts).map(
        mapManuscripts,
      ),
    };
  };

  return {
    id: item.sys.id ?? '',
    grantId: item.grantId ?? undefined,
    teamId: item.teamId ?? undefined,
    displayName: item.displayName ?? '',
    inactiveSince: item.inactiveSince ?? undefined,
    projectTitle: item.projectTitle ?? '',
    lastModifiedDate: new Date(item.sys.publishedAt).toISOString(),
    tags: parseResearchTags(item.researchTagsCollection?.items || []),
    tools,
    supplementGrant: getSupplementGrant(),
    ...parseManuscripts(),
    projectSummary: item.projectSummary ?? undefined,
    members: members.sort(sortMembers),
    labCount,
    pointOfContact: members.find(
      ({ role, alumniSinceDate, inactiveSinceDate }) =>
        role === 'Project Manager' && !alumniSinceDate && !inactiveSinceDate,
    ),
    proposalURL: item.proposal ? item.proposal.sys.id : undefined,
    researchTheme: item.researchTheme?.name ?? undefined,
  };
};

const getCleanTools = (tools: TeamTool[]) =>
  tools.map((tool) =>
    Object.entries(tool).reduce(
      (acc, [key, value]) =>
        value?.trim && value?.trim() === ''
          ? acc // deleted field
          : { ...acc, [key]: value },
      {} as TeamTool,
    ),
  );

const createAndPublishTools = (environment: Environment, tools: TeamTool[]) =>
  Promise.all(
    tools.map(async (tool) => {
      const entry = await environment.createEntry('externalTools', {
        fields: addLocaleToFields(tool),
      });
      return entry.publish();
    }),
  );

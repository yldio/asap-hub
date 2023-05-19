import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';

export type GraphQLWorkingGroup = NonNullable<
  NonNullable<
    NonNullable<gp2Contentful.FetchWorkingGroupByIdQuery>['workingGroups']
  >
>;

export type GraphQLWorkingGroupMember = NonNullable<
  NonNullable<GraphQLWorkingGroup['membersCollection']>
>['items'][number];

type GraphQLWorkingGroupMemberUser = NonNullable<
  NonNullable<GraphQLWorkingGroupMember>['user']
>;
type GraphQLWorkingGroupMemberRole =
  NonNullable<GraphQLWorkingGroupMember>['role'];

export type GraphQLWorkingGroupMilestone = NonNullable<
  NonNullable<
    NonNullable<GraphQLWorkingGroup['milestonesCollection']>
  >['items'][number]
>;

export type GraphQLWorkingGroupResource = NonNullable<
  NonNullable<GraphQLWorkingGroup['resourcesCollection']>
>['items'][number];

export type GraphQLWorkingGroupCalendar = NonNullable<
  GraphQLWorkingGroup['calendar']
>;

const parseWorkingGroupMembers = (
  user: GraphQLWorkingGroupMemberUser,
  role: GraphQLWorkingGroupMemberRole,
): gp2Model.WorkingGroupMember => {
  if (!(role && gp2Model.isWorkingGroupMemberRole(role))) {
    throw new TypeError('Invalid degree received');
  }
  return {
    userId: user.sys.id,
    role,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    avatarUrl: user.avatar?.url || undefined,
  };
};

export function parseWorkingGroupToDataObject(
  workingGroup: GraphQLWorkingGroup,
): gp2Model.WorkingGroupDataObject {
  const members =
    workingGroup.membersCollection?.items.reduce(
      (
        membersList: gp2Model.WorkingGroupMember[],
        member: GraphQLWorkingGroupMember,
      ) => {
        const user = member?.user;
        if (!(user && member.role)) {
          return membersList;
        }
        if (user.onboarded === false) {
          return membersList;
        }
        const groupMember = parseWorkingGroupMembers(user, member.role);
        return [...membersList, groupMember];
      },
      [],
    ) || [];

  const milestones =
    workingGroup.milestonesCollection?.items
      ?.filter(
        (milestone): milestone is GraphQLWorkingGroupMilestone =>
          milestone !== null,
      )
      .map(
        ({
          status,
          title,
          externalLink,
          description,
        }: GraphQLWorkingGroupMilestone) => {
          if (!(status && gp2Model.isMilestoneStatus(status))) {
            throw new TypeError('milestone status is unknown');
          }

          return {
            title: title || '',
            status,
            link: externalLink || undefined,
            description: description || undefined,
          };
        },
      ) || [];

  const resources =
    workingGroup.resourcesCollection?.items?.reduce(parseResources, []) || [];

  const calendar = workingGroup.calendar
    ? {
        id: workingGroup.calendar.sys.id,
        name: workingGroup.calendar.name || '',
      }
    : undefined;

  return {
    id: workingGroup.sys.id,
    title: workingGroup.title || '',
    shortDescription: workingGroup.shortDescription || '',
    description: workingGroup.description || '',
    primaryEmail: workingGroup.primaryEmail || undefined,
    secondaryEmail: workingGroup.secondaryEmail || undefined,
    leadingMembers: workingGroup.leadingMembers || '',
    members,
    milestones,
    resources,
    calendar,
  };
}

export function parseResources(
  resourceList: gp2Model.Resource[],
  resource: GraphQLWorkingGroupResource,
): gp2Model.Resource[] {
  if (
    !(resource?.title && resource.type) ||
    (resource.type === 'Link' && !resource.externalLink)
  ) {
    return resourceList;
  }

  const parsedResource = {
    title: resource.title,
    description: resource.description || undefined,
  };
  if (resource.type === 'Note') {
    return [
      ...resourceList,
      {
        type: 'Note' as const,
        ...parsedResource,
      },
    ];
  }
  const externalLink = resource.externalLink || '';
  return [
    ...resourceList,
    {
      type: 'Link' as const,
      ...parsedResource,
      externalLink,
    },
  ];
}

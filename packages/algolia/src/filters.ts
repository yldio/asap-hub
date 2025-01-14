import { EventConstraint } from '@asap-hub/model';

type Filters = {
  before?: string;
  after?: string;
};

const timeFilter = (time: string, symbol: string) => {
  const timestamp = Math.round(new Date(time).getTime() / 1000);
  return `endDateTimestamp ${symbol} ${timestamp}`;
};

const getFilter = (filters: string[], constraint?: EventConstraint) => {
  if (constraint?.userId && constraint?.teamId) {
    throw new Error('userId and teamId not supported!');
  }
  const constraintFilters = [
    constraint?.teamId && `speakers.team.id: "${constraint.teamId}"`,
    constraint?.userId && `speakers.user.id: "${constraint.userId}"`,
    constraint?.interestGroupId &&
      `interestGroup.id: "${constraint.interestGroupId}"`,
    constraint?.workingGroupId &&
      `workingGroup.id: "${constraint.workingGroupId}"`,
    constraint?.projectId && `project.id: "${constraint.projectId}"`,
    constraint?.notStatus && `NOT status:${constraint.notStatus}`,
  ]
    .filter(Boolean)
    .join(' AND ');

  if (filters.length === 0) {
    return constraintFilters;
  }

  const filter = filters.join(' OR ');
  return constraintFilters ? `(${filter}) AND (${constraintFilters})` : filter;
};

export const getEventFilters = (
  filters: Filters,
  constraints?: EventConstraint,
): string | undefined => {
  const filterList = [
    ...(filters.before ? [timeFilter(filters.before, '<')] : []),
    ...(filters.after ? [timeFilter(filters.after, '>')] : []),
  ];

  return getFilter(filterList, constraints);
};

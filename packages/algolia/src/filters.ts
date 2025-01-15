import {
  EventConstraint as CRNEventConstraint,
  gp2 as gp2Model,
} from '@asap-hub/model';

type EventConstraint = CRNEventConstraint | gp2Model.EventConstraint;

type Filters = {
  before?: string;
  after?: string;
};

const timeFilter = (time: string, symbol: string) => {
  const timestamp = Math.round(new Date(time).getTime() / 1000);
  return `endDateTimestamp ${symbol} ${timestamp}`;
};

const getFilter = (filters: string[], constraint?: EventConstraint) => {
  if (!constraint) return filters.join(' OR ');

  if (constraint.userId && 'teamId' in constraint) {
    throw new Error('userId and teamId not supported!');
  }

  const constraintFiltersList: string[] = [];

  if ('teamId' in constraint && constraint.teamId) {
    constraintFiltersList.push(`speakers.team.id: "${constraint.teamId}"`);
  }
  if ('userId' in constraint && constraint.userId) {
    constraintFiltersList.push(`speakers.user.id: "${constraint.userId}"`);
  }
  if ('interestGroupId' in constraint && constraint.interestGroupId) {
    constraintFiltersList.push(
      `interestGroup.id: "${constraint.interestGroupId}"`,
    );
  }
  if ('workingGroupId' in constraint && constraint.workingGroupId) {
    constraintFiltersList.push(
      `workingGroup.id: "${constraint.workingGroupId}"`,
    );
  }
  if ('notStatus' in constraint && constraint.notStatus) {
    constraintFiltersList.push(`NOT status:${constraint.notStatus}`);
  }

  if ('projectId' in constraint && constraint.projectId) {
    constraintFiltersList.push(`project.id: "${constraint.projectId}"`);
  }

  const constraintFilters = constraintFiltersList.join(' AND ');

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

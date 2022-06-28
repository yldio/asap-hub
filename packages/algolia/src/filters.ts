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
  const constaintFilter =
    constraint &&
    (constraint?.userId
      ? `speakers.user.id: "${constraint.userId}"`
      : `speakers.team.id: "${constraint.teamId}"`);

  if (filters.length === 0) {
    return constaintFilter;
  }

  const filter = filters.join(' OR ');
  return constaintFilter ? `(${filter}) AND ${constaintFilter}` : filter;
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

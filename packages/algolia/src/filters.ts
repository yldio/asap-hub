import { Constraint, isUserConstraint } from '@asap-hub/model';

type Filters = {
  before?: string;
  after?: string;
};

const timeFilter = (time: string, symbol: string) => {
  const timestamp = Math.round(new Date(time).getTime() / 1000);
  return `endDateTimestamp ${symbol} ${timestamp}`;
};

const getFilter = (filters: string[], constraint?: Constraint) => {
  const constaintFilter =
    constraint &&
    (isUserConstraint(constraint.type)
      ? `speakers.user.id: "${constraint.id}"`
      : `speakers.team.id: "${constraint.id}"`);

  if (filters.length === 0) {
    return constaintFilter;
  }

  const filter = filters.join(' OR ');
  return constaintFilter ? `(${filter}) AND ${constaintFilter}` : filter;
};

export const getEventFilters = (
  filters: Filters,
  constraints?: Constraint,
): string | undefined => {
  const filterList = [
    ...(filters.before ? [timeFilter(filters.before, '<')] : []),
    ...(filters.after ? [timeFilter(filters.after, '>')] : []),
  ];
  return getFilter(filterList, constraints);
};

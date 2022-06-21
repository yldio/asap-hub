const timeFilter = (time: string, symbol: string) => {
  const timestamp = Math.round(new Date(time).getTime() / 1000);
  return `endDateTimestamp ${symbol} ${timestamp}`;
};

type Filters = {
  before?: string;
  after?: string;
};
type Constraints = {
  userId?: string;
};
function getFilter(filters: string[], constraint?: Constraints) {
  const constaintFilter =
    constraint?.userId && `speakers.user.id: "${constraint.userId}"`;
  if (filters.length === 0) {
    return constaintFilter;
  }

  const filter = filters.join(' OR ');
  return constaintFilter ? `(${filter}) AND ${constaintFilter}` : filter;
}

export const getEventFilters = (
  filters: Filters,
  constraints?: Constraints,
) => {
  const filterList = [
    ...(filters.before ? [timeFilter(filters.before, '<')] : []),
    ...(filters.after ? [timeFilter(filters.after, '>')] : []),
  ];
  return getFilter(filterList, constraints);
};

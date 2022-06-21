export const getEventFilters = (
  before: string | undefined,
  after: string | undefined,
  constraint?: Constraint,
) => {
  const filters: string[] = [
    ...(before ? [timeFilter(before, '<')] : []),
    ...(after ? [timeFilter(after, '>')] : []),
  ];
  return getFilters(filters, constraint);
};

const timeFilter = (time: string, symbol: string) => {
  const timestamp = Math.round(new Date(time).getTime() / 1000);
  return `endDateTimestamp ${symbol} ${timestamp}`;
};

type Constraint = {
  userId?: string;
};
function getFilters(filters: string[], constraint?: Constraint) {
  const constaintFilter =
    constraint?.userId && `speakers.user.id: "${constraint.userId}"`;
  if (filters.length === 0) {
    return constaintFilter;
  }

  const filter = filters.join(' OR ');
  return constaintFilter ? `(${filter}) AND ${constaintFilter}` : filter;
}

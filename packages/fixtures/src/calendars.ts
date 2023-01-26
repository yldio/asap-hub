import { ListCalendarResponse, CalendarResponse } from '@asap-hub/model';

interface FixtureOptions {
  activeGroups?: boolean;
  incompleteWorkingGroups?: boolean;
}

export const createCalendarResponse = (
  {
    activeGroups = false,
    incompleteWorkingGroups = false,
  }: FixtureOptions = {},
  itemIndex = 0,
): CalendarResponse => ({
  id: `calendar-${itemIndex}`,
  color: '#B1365F',
  name: `Calendar ${itemIndex}`,
  activeGroups,
  incompleteWorkingGroups,
});

export const createListCalendarResponse = (
  items: number = 1,
  options: FixtureOptions = {
    activeGroups: false,
    incompleteWorkingGroups: false,
  },
): ListCalendarResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createCalendarResponse(options, itemIndex),
  ),
});

export default createListCalendarResponse;

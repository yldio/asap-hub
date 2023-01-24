import { ListCalendarResponse, CalendarResponse } from '@asap-hub/model';

interface FixtureOptions {
  group?: boolean;
  workingGroup?: boolean;
}

export const createCalendarResponse = (
  { group = false, workingGroup = false }: FixtureOptions = {},
  itemIndex = 0,
): CalendarResponse => ({
  id: `calendar-${itemIndex}`,
  color: '#B1365F',
  name: `Calendar ${itemIndex}`,
  group,
  workingGroup,
});

export const createListCalendarResponse = (
  items: number = 1,
  options: FixtureOptions = {
    group: false,
    workingGroup: false,
  },
): ListCalendarResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createCalendarResponse(options, itemIndex),
  ),
});

export default createListCalendarResponse;

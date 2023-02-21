import { gp2, googleLegacyCalendarColor } from '@asap-hub/model';

export const createCalendarResponse = (
  itemIndex = 0,
): gp2.CalendarResponse => ({
  id: `calendar-${itemIndex}`,
  color:
    googleLegacyCalendarColor[itemIndex % googleLegacyCalendarColor.length],
  name: `Calendar ${itemIndex}`,
});

export const createListCalendarResponse = (
  items: number = 1,
): gp2.ListCalendarResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createCalendarResponse(itemIndex),
  ),
});

export default createListCalendarResponse;

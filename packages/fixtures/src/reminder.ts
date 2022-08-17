import { ListReminderResponse, ReminderResponse } from '@asap-hub/model';

type FixtureOptions = {
  hasHref?: boolean;
};

export const createReminderResponse = (
  { hasHref = true }: FixtureOptions = {},
  itemIndex = 0,
): ReminderResponse => ({
  id: `r-${itemIndex}`,
  href: hasHref ? 'http://example.com' : undefined,
  description: 'Example Description',
  entity: 'Research Output',
});

export const createListReminderResponse = (
  items = 1,
  options: FixtureOptions = {},
): ListReminderResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createReminderResponse(options, itemIndex),
  ),
});

export default createListReminderResponse;

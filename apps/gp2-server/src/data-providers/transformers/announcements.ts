import { DateTime } from 'luxon';
import { Dashboard } from '../dashboard.data-provider';

type Announcements = Dashboard['announcementsCollection'];

type AnnouncementItem = NonNullable<
  NonNullable<Announcements>['items'][number]
>;
export const parseAnnouncements = (announcements: Announcements) =>
  announcements?.items
    .filter(
      (announcement): announcement is AnnouncementItem => announcement !== null,
    )
    .filter(
      ({ deadline }) => DateTime.fromISO(deadline).toUTC() > DateTime.utc(),
    )
    .map(({ description, deadline, link, sys: { id } }: AnnouncementItem) => ({
      description: description ?? '',
      deadline: DateTime.fromISO(deadline).toUTC().toString(),
      link: link ?? undefined,
      id,
    })) || [];

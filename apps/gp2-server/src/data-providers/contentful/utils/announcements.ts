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
    .map((announcement: AnnouncementItem) => {
      const deadline = DateTime.fromISO(announcement.deadline);
      return {
        description: announcement.description ?? '',
        deadline: deadline.toUTC().toString(),
        link: announcement.link ?? undefined,
      };
    }) || [];

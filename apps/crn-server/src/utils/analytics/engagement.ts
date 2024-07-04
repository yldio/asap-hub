import { FetchEngagementQuery } from '@asap-hub/contentful';
import { EngagementDataObject, TimeRangeOption } from '@asap-hub/model';
import { cleanArray } from '@asap-hub/server-common';
import { getRangeFilterParams } from './common';

export const getEngagementItems = (
  teamCollection: FetchEngagementQuery['teamsCollection'],
  rangeKey?: TimeRangeOption,
): EngagementDataObject[] =>
  cleanArray(teamCollection?.items).map((teamItem) => {
    let totalSpeakers = 0;
    const events = new Set();
    const uniqueSpeakers = {
      allRoles: new Set(),
      keyPersonnel: new Set(),
    };

    cleanArray(teamItem.linkedFrom?.eventSpeakersCollection?.items)
      .filter(getFilterEventByRange(rangeKey))
      .forEach((eventSpeakerItem) => {
        events.add(
          eventSpeakerItem.linkedFrom?.eventsCollection?.items[0]?.sys.id,
        );

        if (eventSpeakerItem.user?.__typename === 'Users') {
          const userRole = cleanArray(
            eventSpeakerItem.user.teamsCollection?.items,
          ).find((speaker) => speaker.team?.sys.id === teamItem.sys.id)?.role;

          const userId = eventSpeakerItem.user.sys.id;

          if (userRole) {
            totalSpeakers += 1;
            uniqueSpeakers.allRoles.add(userId);
            if (userRole === 'Key Personnel') {
              uniqueSpeakers.keyPersonnel.add(userId);
            }
          }
        }
      });

    return {
      id: teamItem.sys.id,
      name: teamItem.displayName || '',
      inactiveSince: teamItem.inactiveSince,
      members: teamItem.linkedFrom?.teamMembershipCollection?.total || 0,
      events: events.size || 0,
      totalSpeakers,
      uniqueSpeakersAllRoles: uniqueSpeakers.allRoles.size,
      uniqueSpeakersKeyPersonnel: uniqueSpeakers.keyPersonnel.size,
    };
  });

export type EventSpeakersCollectionItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<FetchEngagementQuery['teamsCollection']>['items'][number]
    >['linkedFrom']
  >['eventSpeakersCollection']
>['items'][number];

export const getFilterEventByRange =
  (rangeKey?: TimeRangeOption) => (item: EventSpeakersCollectionItem) => {
    const filter = getRangeFilterParams(rangeKey);
    const endDate = item?.linkedFrom?.eventsCollection?.items[0]?.endDate;
    return !endDate || !filter || endDate >= filter;
  };

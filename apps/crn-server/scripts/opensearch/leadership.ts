import { AnalyticsTeamLeadershipDataObject } from '@asap-hub/model';
import { mapLimit } from 'async';

import AnalyticsController from '../../src/controllers/analytics.controller';
import { getAnalyticsDataProvider } from '../../src/dependencies/analytics.dependencies';
import { LEADERSHIP_PAGE_SIZE, MAX_CONCURRENT_PAGES } from './constants';
import {
  IGLeadershipDataObject,
  LeadershipType,
  WGLeadershipDataObject,
} from './types';

const transformLeadershipItem =
  (leadershipType: LeadershipType) =>
  (
    item: AnalyticsTeamLeadershipDataObject,
  ): IGLeadershipDataObject | WGLeadershipDataObject => {
    const baseFields = {
      id: item.id,
      displayName: item.displayName,
      inactiveSince: item.inactiveSince,
      isInactive: !!item.inactiveSince,
    };

    if (leadershipType === 'ig-leadership') {
      return {
        ...baseFields,
        interestGroupLeadershipRoleCount: item.interestGroupLeadershipRoleCount,
        interestGroupPreviousLeadershipRoleCount:
          item.interestGroupPreviousLeadershipRoleCount,
        interestGroupMemberCount: item.interestGroupMemberCount,
        interestGroupPreviousMemberCount: item.interestGroupPreviousMemberCount,
      };
    }

    return {
      ...baseFields,
      workingGroupLeadershipRoleCount: item.workingGroupLeadershipRoleCount,
      workingGroupPreviousLeadershipRoleCount:
        item.workingGroupPreviousLeadershipRoleCount,
      workingGroupMemberCount: item.workingGroupMemberCount,
      workingGroupPreviousMemberCount: item.workingGroupPreviousMemberCount,
    };
  };

export async function exportLeadershipData(
  leadershipType: LeadershipType,
): Promise<(IGLeadershipDataObject | WGLeadershipDataObject)[]> {
  const analyticsController = new AnalyticsController(
    getAnalyticsDataProvider(),
  );
  const allItems: (IGLeadershipDataObject | WGLeadershipDataObject)[] = [];

  console.log(`Fetching ${leadershipType} data...`);

  const firstPage = await analyticsController.fetchTeamLeadership({
    take: LEADERSHIP_PAGE_SIZE,
    skip: 0,
  });

  if (!firstPage) {
    console.log(`No data found for ${leadershipType}`);
    return [];
  }

  const total = firstPage.total;
  const pages = Math.ceil(total / LEADERSHIP_PAGE_SIZE);
  console.log(`Found ${total} items (${pages} pages) for ${leadershipType}`);

  const pageIndexes = [...Array(pages).keys()];

  const responses = await mapLimit(
    pageIndexes,
    MAX_CONCURRENT_PAGES,
    async (pageIndex: number) => {
      if (pageIndex === 0) {
        return firstPage;
      }

      console.log(
        `Fetching page ${pageIndex + 1}/${pages} for ${leadershipType}...`,
      );
      return analyticsController.fetchTeamLeadership({
        take: LEADERSHIP_PAGE_SIZE,
        skip: pageIndex * LEADERSHIP_PAGE_SIZE,
      });
    },
  );

  for (const res of responses) {
    if (!res) {
      continue;
    }
    const enriched = res.items.map(transformLeadershipItem(leadershipType));
    allItems.push(...enriched);
  }

  console.log(
    `Completed fetching ${leadershipType}. Total items: ${allItems.length}`,
  );
  return allItems;
}

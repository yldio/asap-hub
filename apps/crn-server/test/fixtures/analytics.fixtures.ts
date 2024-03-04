import { FetchAnalyticsTeamLeadershipQuery } from '@asap-hub/contentful';
import {
  AnalyticsTeamLeadershipDataObject,
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipDataObject,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import { getTeamDataObject } from './teams.fixtures';

export const getAnalyticsTeamLeadershipDataObject =
  (): AnalyticsTeamLeadershipDataObject => {
    const { id, displayName } = getTeamDataObject();
    return {
      id,
      displayName,
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    };
  };

export const getListAnalyticsTeamLeadershipDataObject =
  (): ListAnalyticsTeamLeadershipDataObject => ({
    total: 1,
    items: [getAnalyticsTeamLeadershipDataObject()],
  });

export const getAnalyticsTeamLeadershipResponse =
  (): AnalyticsTeamLeadershipResponse => getAnalyticsTeamLeadershipDataObject();

export const getListAnalyticsTeamLeadershipResponse =
  (): ListAnalyticsTeamLeadershipResponse => ({
    total: 1,
    items: [getAnalyticsTeamLeadershipResponse()],
  });

export const getAnalyticsTeamLeadershipQuery =
  (): FetchAnalyticsTeamLeadershipQuery => ({
    teamsCollection: {
      total: 1,
      items: [
        {
          sys: {
            id: 'team-id-0',
          },
          displayName: 'Team A',
          linkedFrom: {
            interestGroupsCollection: {
              total: 1,
            },
            teamMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    usersCollection: {
                      items: [
                        {
                          alumniSinceDate: null,
                          linkedFrom: {
                            interestGroupLeadersCollection: {
                              items: [
                                {
                                  linkedFrom: {
                                    interestGroupsCollection: {
                                      items: [
                                        {
                                          sys: {
                                            id: 'interest-group-1',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                            workingGroupMembersCollection: {
                              items: [
                                {
                                  linkedFrom: {
                                    workingGroupsCollection: {
                                      items: [
                                        {
                                          sys: {
                                            id: 'working-group-1',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                            workingGroupLeadersCollection: {
                              items: [
                                {
                                  linkedFrom: {
                                    workingGroupsCollection: {
                                      items: [
                                        {
                                          sys: {
                                            id: 'working-group-1',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });

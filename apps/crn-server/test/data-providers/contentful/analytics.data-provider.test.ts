import {
  FETCH_ANALYTICS_TEAM_LEADERSHIP,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import {
  ListAnalyticsTeamLeadershipDataObject,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import { DateTime } from 'luxon';
import { AnalyticsContentfulDataProvider } from '../../../src/data-providers/contentful/analytics.data-provider';
import {
  getAnalyticsTeamLeadershipQuery,
  getListAnalyticsTeamLeadershipDataObject,
} from '../../fixtures/analytics.fixtures';
import { getContentfulGraphql } from '../../fixtures/teams.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Analytics Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const analyticsDataProvider = new AnalyticsContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ...getContentfulGraphql(),
    });
  const analyticsDataProviderMockGraphql = new AnalyticsContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  describe('FetchTeamLeaderShip method', () => {
    const pastDate = DateTime.now().minus({ days: 1 }).toISODate();

    test('Should fetch the list of analytics team leadership from Contentful GraphQl', async () => {
      const result = await analyticsDataProviderMockGraphql.fetchTeamLeadership(
        {},
      );

      expect(result).toMatchObject({
        total: 1,
        items: [
          {
            ...getListAnalyticsTeamLeadershipDataObject().items[0]!,
            interestGroupLeadershipRoleCount: expect.any(Number),
            interestGroupMemberCount: expect.any(Number),
            interestGroupPreviousLeadershipRoleCount: expect.any(Number),
            interestGroupPreviousMemberCount: expect.any(Number),
            workingGroupLeadershipRoleCount: expect.any(Number),
            workingGroupMemberCount: expect.any(Number),
            workingGroupPreviousLeadershipRoleCount: expect.any(Number),
            workingGroupPreviousMemberCount: expect.any(Number),
          },
        ],
      } satisfies ListAnalyticsTeamLeadershipDataObject);
    });

    test('Should return an empty result when the client returns an empty list', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        teamsCollection: {
          items: [],
          total: 0,
        },
      });

      const result = await analyticsDataProvider.fetchTeamLeadership({});

      expect(result).toEqual({
        total: 0,
        items: [],
      } satisfies ListAnalyticsTeamLeadershipResponse);
    });

    test('Should return an empty result when the client returns nulls inside analyticsTeamLeadershipCollection array', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        teamsCollection: null,
      });

      const result = await analyticsDataProvider.fetchTeamLeadership({});

      expect(result).toEqual({
        total: 0,
        items: [],
      } satisfies ListAnalyticsTeamLeadershipResponse);
    });

    test('Should default the displayName to an empty string when it is missing', async () => {
      const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
      contentfulGraphQLResponse.teamsCollection!.items[0]!.displayName = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await analyticsDataProvider.fetchTeamLeadership({});

      expect(result.items[0]!.displayName).toBe('');
    });

    describe('Pagination', () => {
      test('Should apply pagination parameters', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getAnalyticsTeamLeadershipQuery(),
        );

        await analyticsDataProvider.fetchTeamLeadership({
          take: 13,
          skip: 3,
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_ANALYTICS_TEAM_LEADERSHIP,
          expect.objectContaining({
            limit: 13,
            skip: 3,
          }),
        );
      });

      test('Should pass default pagination parameters', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getAnalyticsTeamLeadershipQuery(),
        );

        await analyticsDataProvider.fetchTeamLeadership({});

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_ANALYTICS_TEAM_LEADERSHIP,
          expect.objectContaining({
            limit: 10,
            skip: 0,
          }),
        );
      });
    });

    describe('Interest Groups', () => {
      describe('Interest Group Leadership Role Count', () => {
        test('Should return 0 for interestGroupLeadershipRoleCount when the client returns interestGroupLeadersCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return 0 for interestGroupLeadershipRoleCount when usersCollection is undefined', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection = undefined;
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return 0 for interestGroupLeadershipRoleCount when teamMembershipCollection is undefined', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection = undefined;
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return interestGroupLeadershipRoleCount of 2 when two users are leaders of two different interest groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
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
                                id: 'interest-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(2);
        });

        test('Should return interestGroupLeadershipRoleCount of 2 when two users are leaders of 3 interest groups two of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
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
                                id: 'interest-group-id-1',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      linkedFrom: {
                        interestGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'interest-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(2);
        });

        test('Should return interestGroupLeadershipRoleCount of 2 when 3 users are leaders of 3 different interest groups but one of them is an alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
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
                                id: 'interest-group-id-2',
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
          );
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                interestGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        interestGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'interest-group-id-3',
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
          );

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(2);
        });
      });

      describe('Interest Group Previous Leadership Role Count', () => {
        test('Should return 0 for interestGroupPreviousLeadershipRoleCount when the client returns interestGroupLeadersCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(
            result.items[0]!.interestGroupPreviousLeadershipRoleCount,
          ).toBe(0);
        });

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when two alumni users are leaders of two different interest groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                interestGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        interestGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'interest-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(
            result.items[0]!.interestGroupPreviousLeadershipRoleCount,
          ).toBe(2);
        });

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when 3 users are leaders of 3 different interest groups but only two are alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                interestGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        interestGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'interest-group-id-2',
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
          );
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
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
                                id: 'interest-group-id-3',
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
          );

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(
            result.items[0]!.interestGroupPreviousLeadershipRoleCount,
          ).toBe(2);
        });

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when two users are leaders of 3 interest groups two of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                interestGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        interestGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'interest-group-id-1',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      linkedFrom: {
                        interestGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'interest-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(
            result.items[0]!.interestGroupPreviousLeadershipRoleCount,
          ).toBe(2);
        });
      });

      describe('Interest Group Member Count', () => {
        test('Should return 0 for interestGroupMemberCount when the client returns interestGroupsCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.total = 0;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(0);
        });

        test('Should return interestGroupMemberCount of 2 when the client returns a total of 2 interest groups associated with a team', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.total = 2;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(2);
        });

        test('Should return interestGroupMemberCount of 0 when the client returns a total of 2 interest groups associated with a team but the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.total = 2;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(0);
        });
      });

      describe('Interest Group Previous Member Count', () => {
        test('Should return 0 for interestGroupPreviousMemberCount when the client returns interestGroupsCollection items as an empty array and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.total = 0;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(0);
        });

        test('Should return interestGroupPreviousMemberCount of 2 when the client returns a total of 2 interest groups associated with a team and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.total = 2;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(2);
        });

        test('Should return interestGroupMemberCount of 0 when the client returns a total of 2 interest groups associated with a team but the team is active', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.total = 2;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(0);
        });
      });
    });

    describe('Working Groups', () => {
      describe('Working Group Leadership Role Count', () => {
        test('Should return 0 for workingGroupLeadershipRoleCount when the client returns workingGroupLeadersCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return workingGroupLeadershipRoleCount of 2 when two users are leaders of two different working groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupLeadershipRoleCount).toBe(2);
        });

        test('Should return workingGroupLeadershipRoleCount of 2 when two users are leaders of 3 working groups two of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-1',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupLeadershipRoleCount).toBe(2);
        });

        test('Should return workingGroupLeadershipRoleCount of 2 when 3 users are leaders of 3 different working groups but one of them is an alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-3',
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
          );

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupLeadershipRoleCount).toBe(2);
        });
      });

      describe('Working Group Previous Leadership Role Count', () => {
        test('Should return 0 for workingGroupPreviousLeadershipRoleCount when the client returns workingGroupLeadersCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            0,
          );
        });

        test('Should return workingGroupPreviousLeadershipRoleCount of 2 when two alumni users are leaders of two different working groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            2,
          );
        });

        test('Should return workingGroupPreviousLeadershipRoleCount of 2 when 3 users are leaders of 3 different working groups but only two are alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-3',
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
          );

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            2,
          );
        });

        test('Should return workingGroupPreviousLeadershipRoleCount of 2 when two users are leaders of 3 working groups two of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupLeadersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupLeadersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-1',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            2,
          );
        });
      });

      describe('Working Group Member Count', () => {
        test('Should return 0 for workingGroupMemberCount when the client returns workingGroupMembersCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupMemberCount).toBe(0);
        });

        test('Should return workingGroupMemberCount of 2 when two users are members of two different working groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupMemberCount).toBe(2);
        });

        test('Should return workingGroupMemberCount of 2 when two users are members of 3 working groups two of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-1',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupMemberCount).toBe(2);
        });

        test('Should return workingGroupMemberCount of 2 when 3 users are members of 3 different working groups but one of them is an alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-3',
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
          );

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupMemberCount).toBe(2);
        });
      });

      describe('Working Group Previous Member Count', () => {
        test('Should return 0 for workingGroupPreviousMemberCount when the client returns workingGroupMembersCollection items as an empty array', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(0);
        });

        test('Should return workingGroupPreviousMemberCount of 2 when two alumni users are members of two different working groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(2);
        });

        test('Should return workingGroupPreviousMemberCount of 2 when 3 users are members of 3 different working groups but only two are alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: null,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-3',
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
          );

          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(2);
        });

        test('Should return workingGroupPreviousMemberCount of 2 when two users are members of 3 working groups two of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.workingGroupMembersCollection!.items[0]!.linkedFrom!.workingGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'working-group-id-1',
                },
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items.push(
            {
              alumniSinceDate: pastDate,
              linkedFrom: {
                workingGroupMembersCollection: {
                  items: [
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-1',
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      linkedFrom: {
                        workingGroupsCollection: {
                          items: [
                            {
                              sys: {
                                id: 'working-group-id-2',
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
          );
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(2);
        });
      });
    });
  });
});

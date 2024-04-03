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
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection =
            undefined;
          [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return 0 for interestGroupLeadershipRoleCount when teamMembershipCollection is undefined', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection =
            undefined;
          [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return 0 for interestGroupLeadershipRoleCount when team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return interestGroupLeadershipRoleCount of 2 when two users are leaders of two different active interest groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: true,
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

        test('Should return interestGroupLeadershipRoleCount of 1 when two users are leaders of two different interest groups but one interest group is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: false,
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

          expect(result.items[0]!.interestGroupLeadershipRoleCount).toBe(1);
        });

        test('Should return interestGroupLeadershipRoleCount of 2 when 2 users are leaders of 3 interest groups 2 of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: true,
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
                              active: true,
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
                active: true,
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
                              active: true,
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
                              active: true,
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

        test('Should return 1 for interestGroupPreviousLeadershipRoleCount when team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(
            result.items[0]!.interestGroupPreviousLeadershipRoleCount,
          ).toBe(1);
        });

        test('Should return 2 for interestGroupPreviousLeadershipRoleCount when team is inactive and has one current interest group leader and one alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
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
                              active: true,
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

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when two alumni users are leaders of 2 different active interest groups', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: true,
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

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when 3 users are leaders of 3 different active interest groups but 2 are alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: true,
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
                              active: true,
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

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when 2 users are leaders of 3 active interest groups 2 of which are unique', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: true,
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
                              active: true,
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

        test('Should return interestGroupPreviousLeadershipRoleCount of 1 when 2 active users are leaders of 2 different interest groups one of which is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: true,
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
                              active: false,
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
          ).toBe(1);
        });

        test('Should return interestGroupPreviousLeadershipRoleCount of 2 when 1 active user is a leader of an inactive interest group nd 1 is an alumni and a leader of a different active interest group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();

          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-id-1',
                },
                active: false,
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
                              active: true,
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
        test('Should return 0 for interestGroupMemberCount when the client returns interestGroupsCollection and interestGroupLeadersCollection items as empty arrays', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items =
            [];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(0);
        });

        test('Should return 0 for interestGroupMemberCount when the client returns teamMembershipCollection and interestGroupLeadersCollection items as null', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection =
            null;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(0);
        });

        test('Should return interestGroupMemberCount of 2 when the client returns a total of 2 active interest groups associated with a team', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(2);
        });

        test('Should return interestGroupMemberCount of 1 when the client returns a total of 2 interest groups associated with a team one of which is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: false,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(1);
        });

        test('Should return interestGroupMemberCount of 3 when the client returns a total of 2 active interest groups associated with a team and one leader of another active interest group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-3',
                },
                active: true,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(3);
        });

        test('Should return interestGroupMemberCount of 2 when the client returns a total of 2 active interest groups associated with a team and one leader of a different inactive interest group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-3',
                },
                active: false,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(2);
        });

        test('Should return interestGroupMemberCount of 2 when the client returns a total of 2 active interest groups associated with a team and one leader of the same interest group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
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
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupMemberCount).toBe(0);
        });
      });

      describe('Interest Group Previous Member Count', () => {
        test('Should return 0 for interestGroupPreviousMemberCount when the client returns interestGroupsCollection and interestGroupLeadersCollection items as empty arrays and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items =
            [];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(0);
        });

        test('Should return 0 for interestGroupPreviousMemberCount when the client returns interestGroupsCollection and interestGroupLeadersCollection items as null and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection =
            null;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(0);
        });

        test('Should return interestGroupPreviousMemberCount of 2 when the client returns a total of 2 active interest groups associated with a team and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(2);
        });

        test('Should return interestGroupPreviousMemberCount of 3 when the client returns a total of 2 active interest groups associated with the team and one leader of another interest group and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-3',
                },
                active: true,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(3);
        });

        test('Should return interestGroupPreviousMemberCount of 2 when the client returns a total of 2 activ interest groups associated with the team and one leader of the same interest group and the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(2);
        });

        test('Should return interestGroupPreviousMemberCount of 0 when the client returns a total of 2 active interest groups associated with a team and the team is active', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: true,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(0);
        });

        test('Should return interestGroupPreviousMemberCount of 1 when the client returns a total of 2 interest groups 1 of which is inactive and the team is active', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: false,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(1);
        });

        test('Should return interestGroupPreviousMemberCount of 2 when the client returns a total of 2 interest groups 1 of which is inactive and one leader of a different, inactive interest group and the team is active', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            null;
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-1',
                },
                active: true,
              },
              {
                sys: {
                  id: 'interest-group-2',
                },
                active: false,
              },
            ];
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.linkedFrom!.interestGroupLeadersCollection!.items[0]!.linkedFrom!.interestGroupsCollection!.items =
            [
              {
                sys: {
                  id: 'interest-group-3',
                },
                active: false,
              },
            ];
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.interestGroupPreviousMemberCount).toBe(2);
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

        test('Should return workingGroupLeadershipRoleCount of 1 when 1 user is a leader of a working group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupLeadershipRoleCount).toBe(1);
        });

        test('Should return workingGroupLeadershipRoleCount of 0 when 1 user is a leader of a working group but the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupLeadershipRoleCount).toBe(0);
        });

        test('Should return workingGroupLeadershipRoleCount of 2 when 2 users are leaders of 2 different working groups', async () => {
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

        test('Should return workingGroupPreviousLeadershipRoleCount of 0 when the leader of a working group is not alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            0,
          );
        });

        test('Should return workingGroupPreviousLeadershipRoleCount of 1 when the leader of a working group is not alumni but the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            1,
          );
        });

        test('Should return workingGroupPreviousLeadershipRoleCount of 2 when team is inactive and has one current working group leader and one alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
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

        test('Should return workingGroupPreviousLeadershipRoleCount of 1 when 1 alumni user is a leader of a working group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousLeadershipRoleCount).toBe(
            1,
          );
        });

        test('Should return workingGroupPreviousLeadershipRoleCount of 2 when 2 alumni users are leaders of two different working groups', async () => {
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

        test('Should return workingGroupMemberCount of 1 when 1 user is a member of a working group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupMemberCount).toBe(1);
        });

        test('Should return workingGroupMemberCount of 0 when 1 user is a member of a working group but the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
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

        test('Should return workingGroupPreviousMemberCount of 0 when the member of a working group is not an alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(0);
        });

        test('Should return workingGroupPreviousMemberCount of 1 when 1 alumni user is a member of a working group', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items[0]!.linkedFrom!.usersCollection!.items[0]!.alumniSinceDate =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(1);
        });

        test('Should return workingGroupPreviousMemberCount of 1 when the member of a working group is not alumni but the team is inactive', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            contentfulGraphQLResponse,
          );

          const result = await analyticsDataProvider.fetchTeamLeadership({});

          expect(result.items[0]!.workingGroupPreviousMemberCount).toBe(1);
        });

        test('Should return workingGroupPreviousMemberCount of 2 when team is inactive and has one current working group leader and one alumni', async () => {
          const contentfulGraphQLResponse = getAnalyticsTeamLeadershipQuery();
          contentfulGraphQLResponse.teamsCollection!.items[0]!.inactiveSince =
            pastDate;
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

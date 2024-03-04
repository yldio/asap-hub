import { gql } from 'graphql-tag';

export const FETCH_ANALYTICS_TEAM_LEADERSHIP = gql`
  query FetchAnalyticsTeamLeadership {
    teamsCollection(limit: 10, order: displayName_ASC) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        linkedFrom {
          interestGroupsCollection(limit: 10) {
            total
          }
          teamMembershipCollection(limit: 20) {
            items {
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    alumniSinceDate
                    linkedFrom {
                      interestGroupLeadersCollection(limit: 3) {
                        items {
                          linkedFrom {
                            interestGroupsCollection(limit: 1) {
                              items {
                                sys {
                                  id
                                }
                              }
                            }
                          }
                        }
                      }
                      workingGroupMembersCollection(limit: 3) {
                        items {
                          linkedFrom {
                            workingGroupsCollection(limit: 1) {
                              items {
                                sys {
                                  id
                                }
                              }
                            }
                          }
                        }
                      }
                      workingGroupLeadersCollection(limit: 3) {
                        items {
                          linkedFrom {
                            workingGroupsCollection(limit: 1) {
                              items {
                                sys {
                                  id
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

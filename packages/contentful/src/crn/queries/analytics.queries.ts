/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_ANALYTICS_TEAM_LEADERSHIP = gql`
  query FetchAnalyticsTeamLeadership($limit: Int, $skip: Int) {
    teamsCollection(order: displayName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        linkedFrom {
          interestGroupsCollection(limit: 50) {
            items {
              sys {
                id
              }
              active
            }
          }
          teamMembershipCollection(limit: 100) {
            items {
              inactiveSinceDate
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    alumniSinceDate
                    linkedFrom {
                      interestGroupLeadersCollection(limit: 10) {
                        items {
                          inactiveSinceDate
                          role
                          linkedFrom {
                            interestGroupsCollection(limit: 1) {
                              items {
                                sys {
                                  id
                                }
                                active
                              }
                            }
                          }
                        }
                      }
                      workingGroupMembersCollection(limit: 10) {
                        items {
                          inactiveSinceDate
                          linkedFrom {
                            workingGroupsCollection(limit: 1) {
                              items {
                                sys {
                                  id
                                }
                                complete
                              }
                            }
                          }
                        }
                      }
                      workingGroupLeadersCollection(limit: 10) {
                        items {
                          inactiveSinceDate
                          role
                          linkedFrom {
                            workingGroupsCollection(limit: 1) {
                              items {
                                sys {
                                  id
                                }
                                complete
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

export const FETCH_USER_PRODUCTIVITY = gql`
  query FetchUserProductivity($limit: Int, $skip: Int) {
    usersCollection(order: firstName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        firstName
        lastName
        nickname
        alumniSinceDate
        teamsCollection(limit: 20) {
          items {
            team {
              sys {
                id
              }
              displayName
              inactiveSince
            }
            role
            inactiveSinceDate
          }
        }
        linkedFrom {
          researchOutputsCollection(limit: 100) {
            items {
              addedDate
              createdDate
              sharingStatus
              documentType
              authorsCollection(limit: 20) {
                items {
                  __typename
                  ... on Users {
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
`;

export const FETCH_TEAM_PRODUCTIVITY = gql`
  query FetchTeamProductivity($limit: Int, $skip: Int) {
    teamsCollection(order: displayName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        linkedFrom {
          researchOutputsCollection(limit: 2000) {
            items {
              addedDate
              createdDate
              documentType
              sharingStatus
            }
          }
        }
      }
    }
  }
`;

export const FETCH_USER_COLLABORATION = gql`
  query FetchUserCollaboration($limit: Int, $skip: Int) {
    usersCollection(order: firstName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        firstName
        lastName
        nickname
        alumniSinceDate
        labsCollection(limit: 10) {
          items {
            sys {
              id
            }
          }
        }
        teamsCollection(limit: 10) {
          items {
            team {
              sys {
                id
              }
              displayName
              inactiveSince
            }
            role
            inactiveSinceDate
          }
        }
        linkedFrom {
          researchOutputsCollection(limit: 200) {
            items {
              addedDate
              sharingStatus
              authorsCollection(limit: 10) {
                items {
                  __typename
                  ... on Users {
                    sys {
                      id
                    }
                    labsCollection(limit: 10) {
                      items {
                        sys {
                          id
                        }
                      }
                    }
                    teamsCollection(limit: 10) {
                      items {
                        team {
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
`;

export const FETCH_TEAM_COLLABORATION = gql`
  query FetchTeamCollaboration($limit: Int, $skip: Int) {
    teamsCollection(order: displayName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        linkedFrom {
          researchOutputsCollection(limit: 850) {
            items {
              addedDate
              createdDate
              documentType
              labsCollection(limit: 2) {
                total
              }
              teamsCollection(limit: 20) {
                items {
                  sys {
                    id
                  }
                  displayName
                  inactiveSince
                }
              }
            }
          }
        }
      }
    }
  }
`;

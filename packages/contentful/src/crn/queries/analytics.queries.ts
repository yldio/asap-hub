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
          interestGroupsCollection(limit: 10) {
            items {
              sys {
                id
              }
              active
            }
          }
          teamMembershipCollection(limit: 20) {
            items {
              inactiveSinceDate
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    alumniSinceDate
                    linkedFrom {
                      interestGroupLeadersCollection(limit: 3) {
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
                      workingGroupMembersCollection(limit: 3) {
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
                      workingGroupLeadersCollection(limit: 3) {
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
        teamsCollection(limit: 3) {
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
          researchOutputsCollection(limit: 20) {
            items {
              addedDate
              createdDate
              sharingStatus
              authorsCollection(limit: 10) {
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
          researchOutputsCollection(limit: 1000) {
            items {
              addedDate
              createdDate
              documentType
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
        labsCollection(limit: 3) {
          items {
            sys {
              id
            }
          }
        }
        teamsCollection(limit: 3) {
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
          researchOutputsCollection(limit: 20) {
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
                    labsCollection(limit: 3) {
                      items {
                        sys {
                          id
                        }
                      }
                    }
                    teamsCollection(limit: 3) {
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

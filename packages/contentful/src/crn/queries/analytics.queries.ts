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

export const FETCH_USER_TOTAL_RESEARCH_OUTPUTS = gql`
  query FetchUserTotalResearchOutputs($skip: Int) {
    usersCollection(order: firstName_ASC, limit: 1000, skip: $skip) {
      total
      items {
        sys {
          id
        }
        firstName
        lastName
        nickname
        alumniSinceDate
        labsCollection(limit: 5) {
          items {
            sys {
              id
            }
          }
        }
        teamsCollection(limit: 5) {
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
          researchOutputsCollection(limit: 1) {
            total
          }
        }
      }
    }
  }
`;

export const FETCH_USER_RESEARCH_OUTPUTS = gql`
  query FetchUserResearchOutputs($limit: Int, $skip: Int) {
    usersCollection(order: firstName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        linkedFrom {
          researchOutputsCollection(limit: 250) {
            items {
              sys {
                id
              }
              addedDate
              documentType
              authorsCollection(limit: 120) {
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
              sharingStatus
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

export const FETCH_ENGAGEMENT = gql`
  query FetchEngagement($limit: Int, $skip: Int) {
    teamsCollection(order: displayName_ASC, limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        linkedFrom {
          teamMembershipCollection(limit: 100) {
            items {
              role
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    onboarded
                  }
                }
              }
            }
          }
          eventSpeakersCollection(limit: 100) {
            items {
              linkedFrom {
                eventsCollection(limit: 1) {
                  items {
                    sys {
                      id
                    }
                    endDate
                  }
                }
              }
              user {
                __typename
                ... on Users {
                  sys {
                    id
                  }
                  teamsCollection(limit: 3) {
                    items {
                      team {
                        sys {
                          id
                        }
                      }
                      role
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

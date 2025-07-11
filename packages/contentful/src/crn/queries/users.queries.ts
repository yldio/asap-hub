/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const usersContentQueryFragment = gql`
  fragment UsersContent on Users {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    activeCampaignId
    lastUpdated
    alumniSinceDate
    alumniLocation
    biography
    connections
    createdDate
    degree
    email
    contactEmail
    dismissedGettingStarted
    firstName
    middleName
    lastName
    nickname
    institution
    jobTitle
    country
    stateOrProvince
    city
    onboarded
    orcid
    orcidLastModifiedDate
    orcidLastSyncDate
    orcidWorks
    questions
    expertiseAndResourceDescription
    github
    googleScholar
    linkedIn
    researcherId
    researchGate
    twitter
    website1
    website2
    role
    openScienceTeamMember
    responsibilities
    researchInterests
    reachOut
    avatar {
      url
    }
    researchTagsCollection(limit: 20) {
      items {
        sys {
          id
        }
        name
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
          researchTheme {
            name
          }
          proposal {
            sys {
              id
            }
          }
          linkedFrom {
            interestGroupsTeamsCollection(limit: 10) {
              items {
                linkedFrom {
                  interestGroupsCollection(limit: 1) {
                    items {
                      sys {
                        id
                      }
                      active
                      name
                    }
                  }
                }
              }
            }
          }
        }
        role
        inactiveSinceDate
      }
    }
    labsCollection(limit: 10) {
      items {
        sys {
          id
        }
        name
      }
    }
    linkedFrom {
      workingGroupMembersCollection(limit: 10) {
        items {
          inactiveSinceDate
          linkedFrom {
            workingGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                title
                complete
              }
            }
          }
          user {
            lastName
          }
        }
      }
      workingGroupLeadersCollection(limit: 10) {
        items {
          role
          inactiveSinceDate
          linkedFrom {
            workingGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                title
                complete
              }
            }
          }
          user {
            lastName
          }
        }
      }
      interestGroupLeadersCollection(limit: 10) {
        items {
          role
          linkedFrom {
            interestGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                active
                name
              }
            }
          }
        }
      }
      researchOutputsCollection @include(if: $publicUser) {
        items {
          sys {
            id
          }
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
`;

export const FETCH_PUBLIC_USERS = gql`
  query FetchPublicUsers(
    $limit: Int
    $skip: Int
    $order: [UsersOrder]
    $where: UsersFilter
  ) {
    usersCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        avatar {
          url
        }
        alumniSinceDate
        biography
        city
        country
        createdDate
        lastUpdated
        degree
        firstName
        lastName
        institution
        website1
        website2
        linkedIn
        orcid
        researcherId
        twitter
        github
        googleScholar
        researchGate
        researchTagsCollection(limit: 20) {
          items {
            name
          }
        }
        teamsCollection(limit: 10) {
          items {
            team {
              displayName
              researchTheme {
                name
              }
              linkedFrom {
                interestGroupsTeamsCollection(limit: 10) {
                  items {
                    linkedFrom {
                      interestGroupsCollection(limit: 1) {
                        items {
                          sys {
                            id
                          }
                          active
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
            role
            inactiveSinceDate
          }
        }
        labsCollection(limit: 10) {
          items {
            sys {
              id
            }
            name
          }
        }
        linkedFrom {
          workingGroupMembersCollection(limit: 10) {
            items {
              inactiveSinceDate
              linkedFrom {
                workingGroupsCollection(limit: 1) {
                  items {
                    title
                    complete
                  }
                }
              }
            }
          }
          workingGroupLeadersCollection(limit: 10) {
            items {
              role
              inactiveSinceDate
              linkedFrom {
                workingGroupsCollection(limit: 1) {
                  items {
                    title
                    complete
                  }
                }
              }
            }
          }
          interestGroupLeadersCollection(limit: 10) {
            items {
              role
              linkedFrom {
                interestGroupsCollection(limit: 1) {
                  items {
                    sys {
                      id
                    }
                    active
                    name
                  }
                }
              }
            }
          }
          researchOutputsCollection(limit: 20) {
            items {
              sys {
                id
              }
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

export const FETCH_USER_BY_ID = gql`
  query FetchUserById($id: String!, $publicUser: Boolean = false) {
    users(id: $id) {
      ...UsersContent
    }
  }
  ${usersContentQueryFragment}
`;

export const userListItemContentQueryFragment = gql`
  fragment UserListItemContent on Users {
    alumniSinceDate
    avatar {
      url
    }
    city
    stateOrProvince
    country
    createdDate
    degree
    email
    firstName
    sys {
      id
    }
    institution
    jobTitle
    labsCollection(limit: 10) {
      items {
        sys {
          id
        }
        name
      }
    }
    lastName
    middleName
    nickname
    onboarded
    dismissedGettingStarted
    role
    openScienceTeamMember
    researchTagsCollection(limit: 20) {
      items {
        sys {
          id
        }
        name
      }
    }
    teamsCollection(limit: 10) {
      items {
        team {
          sys {
            id
          }
          displayName
        }
        role
      }
    }
  }
`;

export const FETCH_USERS = gql`
  query FetchUsers(
    $limit: Int
    $skip: Int
    $order: [UsersOrder]
    $where: UsersFilter
  ) {
    usersCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        ...UserListItemContent
      }
    }
  }
  ${userListItemContentQueryFragment}
`;

export const FETCH_USERS_BY_TEAM_ID = gql`
  query FetchUsersByTeamId($id: String!, $limit: Int, $skip: Int) {
    teamMembershipCollection(
      limit: $limit
      skip: $skip
      where: { team: { sys: { id: $id } } }
    ) {
      total
      items {
        linkedFrom {
          usersCollection(limit: 1) {
            items {
              ...UserListItemContent
            }
          }
        }
      }
    }
  }
  ${userListItemContentQueryFragment}
`;

export const FETCH_USERS_BY_LAB_ID = gql`
  query FetchUsersByLabId($id: String!, $limit: Int, $skip: Int) {
    labs(id: $id) {
      linkedFrom {
        labMembershipCollection(limit: $limit, skip: $skip) {
          total
          items {
            linkedFrom {
              usersCollection(limit: 1) {
                items {
                  ...UserListItemContent
                }
              }
            }
          }
        }
      }
    }
  }
  ${userListItemContentQueryFragment}
`;

/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_REMINDERS = gql`
  query FetchReminders(
    $researchOutputFilter: ResearchOutputsFilter
    $eventFilter: EventsFilter
    $userId: String!
    $researchOutputVersionsFilter: ResearchOutputVersionsFilter
    $manuscriptFilter: ManuscriptsFilter
  ) {
    manuscriptsCollection(where: $manuscriptFilter) {
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        title
        status
        previousStatus
        statusUpdatedAt
        statusUpdatedBy {
          sys {
            id
          }
          firstName
          lastName
        }
        teamsCollection(limit: 10) {
          items {
            sys {
              id
            }
            displayName
          }
        }
        versionsCollection(limit: 10) {
          total
          items {
            count
            createdBy {
              sys {
                id
              }
              firstName
              lastName
            }
            firstAuthorsCollection(limit: 10) {
              items {
                __typename
                ... on Users {
                  sys {
                    id
                  }
                }
              }
            }
            additionalAuthorsCollection(limit: 10) {
              items {
                __typename
                ... on Users {
                  sys {
                    id
                  }
                }
              }
            }
            correspondingAuthorCollection(limit: 10) {
              items {
                __typename
                ... on Users {
                  sys {
                    id
                  }
                }
              }
            }
            labsCollection(limit: 10) {
              items {
                labPi {
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
    researchOutputsCollection(where: $researchOutputFilter, preview: true) {
      items {
        sys {
          id
          publishedAt
        }
        addedDate
        createdDate
        documentType
        title
        teamsCollection(limit: 10) {
          items {
            sys {
              id
            }
            displayName
          }
        }
        workingGroup {
          sys {
            id
          }
          title
        }
        createdBy {
          sys {
            id
          }
          firstName
          lastName
        }
        statusChangedAt
        statusChangedBy {
          sys {
            id
          }
          firstName
          lastName
        }
        isInReview
      }
    }
    eventsCollection(where: $eventFilter) {
      items {
        sys {
          id
        }
        startDate
        endDate
        title
        videoRecordingUpdatedAt
        presentationUpdatedAt
        notesUpdatedAt
        speakersCollection(limit: 30) {
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
    users(id: $userId) {
      role
      openScienceTeamMember
      teamsCollection {
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
      linkedFrom {
        workingGroupMembersCollection(limit: 10) {
          items {
            linkedFrom {
              workingGroupsCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                  title
                }
              }
            }
          }
        }
        workingGroupLeadersCollection(limit: 10) {
          items {
            role
            linkedFrom {
              workingGroupsCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                  title
                }
              }
            }
          }
        }
        eventSpeakersCollection(limit: 100) {
          items {
            team {
              sys {
                id
              }
            }
            linkedFrom {
              eventsCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                  title
                  endDate
                }
              }
            }
          }
        }
      }
    }
    researchOutputVersionsCollection(where: $researchOutputVersionsFilter) {
      items {
        sys {
          id
          publishedAt
        }
        linkedFrom {
          researchOutputsCollection(limit: 1) {
            items {
              sys {
                id
              }
              title
              documentType
              teamsCollection(limit: 10) {
                items {
                  sys {
                    id
                  }
                  displayName
                }
              }
              workingGroup {
                sys {
                  id
                }
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const FETCH_TEAM_PROJECT_MANAGER = gql`
  query FetchTeamProjectManager($id: String!) {
    teamMembershipCollection(
      where: {
        AND: [{ team: { sys: { id: $id } } }, { role: "Project Manager" }]
      }
    ) {
      items {
        linkedFrom {
          usersCollection(limit: 1) {
            total
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
`;

export const FETCH_DISCUSSION_REMINDERS = gql`
  query FetchDiscussionReminders(
    $discussionFilter: DiscussionsFilter
    $messageFilter: MessagesFilter
  ) {
    discussionsCollection(where: $discussionFilter) {
      items {
        sys {
          id
          firstPublishedAt
        }
        endedAt
        endedBy {
          sys {
            id
          }
          firstName
          lastName
          teamsCollection(
            limit: 10
            where: { inactiveSinceDate_exists: false }
          ) {
            items {
              team {
                sys {
                  id
                }
                displayName
                inactiveSince
              }
            }
          }
        }
        message {
          createdBy {
            sys {
              id
            }
            firstName
            lastName
            role
            openScienceTeamMember
            teamsCollection(
              limit: 10
              where: { inactiveSinceDate_exists: false }
            ) {
              items {
                team {
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
        linkedFrom {
          complianceReportsCollection(limit: 1) {
            items {
              manuscriptVersion {
                teamsCollection(limit: 10) {
                  items {
                    sys {
                      id
                    }
                    displayName
                  }
                }
                firstAuthorsCollection(limit: 10) {
                  items {
                    __typename
                    ... on Users {
                      sys {
                        id
                      }
                    }
                  }
                }
                additionalAuthorsCollection(limit: 10) {
                  items {
                    __typename
                    ... on Users {
                      sys {
                        id
                      }
                    }
                  }
                }
                correspondingAuthorCollection(limit: 10) {
                  items {
                    __typename
                    ... on Users {
                      sys {
                        id
                      }
                    }
                  }
                }
                labsCollection(limit: 10) {
                  items {
                    labPi {
                      sys {
                        id
                      }
                    }
                  }
                }
                linkedFrom {
                  manuscriptsCollection(limit: 1) {
                    items {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    messagesCollection(where: $messageFilter) {
      items {
        sys {
          id
          firstPublishedAt
        }
        createdBy {
          sys {
            id
          }
          firstName
          lastName
          role
          openScienceTeamMember
          teamsCollection(
            limit: 10
            where: { inactiveSinceDate_exists: false }
          ) {
            items {
              team {
                sys {
                  id
                }
                displayName
                inactiveSince
              }
            }
          }
        }
        linkedFrom {
          discussionsCollection(limit: 1) {
            items {
              message {
                sys {
                  id
                }
              }
              linkedFrom {
                complianceReportsCollection(limit: 1) {
                  items {
                    manuscriptVersion {
                      teamsCollection(limit: 10) {
                        items {
                          sys {
                            id
                          }
                          displayName
                        }
                      }
                      firstAuthorsCollection(limit: 10) {
                        items {
                          __typename
                          ... on Users {
                            sys {
                              id
                            }
                          }
                        }
                      }
                      additionalAuthorsCollection(limit: 10) {
                        items {
                          __typename
                          ... on Users {
                            sys {
                              id
                            }
                          }
                        }
                      }
                      correspondingAuthorCollection(limit: 10) {
                        items {
                          __typename
                          ... on Users {
                            sys {
                              id
                            }
                          }
                        }
                      }
                      labsCollection(limit: 10) {
                        items {
                          labPi {
                            sys {
                              id
                            }
                          }
                        }
                      }
                      linkedFrom {
                        manuscriptsCollection(limit: 1) {
                          items {
                            title
                          }
                        }
                      }
                    }
                  }
                }
                manuscriptVersionsCollection(limit: 1) {
                  items {
                    teamsCollection(limit: 10) {
                      items {
                        sys {
                          id
                        }
                        displayName
                      }
                    }
                    firstAuthorsCollection(limit: 10) {
                      items {
                        __typename
                        ... on Users {
                          sys {
                            id
                          }
                        }
                      }
                    }
                    additionalAuthorsCollection(limit: 10) {
                      items {
                        __typename
                        ... on Users {
                          sys {
                            id
                          }
                        }
                      }
                    }
                    correspondingAuthorCollection(limit: 10) {
                      items {
                        __typename
                        ... on Users {
                          sys {
                            id
                          }
                        }
                      }
                    }
                    labsCollection(limit: 10) {
                      items {
                        labPi {
                          sys {
                            id
                          }
                        }
                      }
                    }
                    linkedFrom {
                      manuscriptsCollection(limit: 1) {
                        items {
                          title
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

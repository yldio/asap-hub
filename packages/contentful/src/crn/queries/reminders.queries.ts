/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_REMINDERS = gql`
  query FetchReminders(
    $researchOutputFilter: ResearchOutputsFilter
    $eventFilter: EventsFilter
    $userId: String!
  ) {
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

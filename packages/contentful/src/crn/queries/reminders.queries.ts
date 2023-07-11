/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_REMINDERS = gql`
  query FetchReminders($eventFilter: EventsFilter, $userId: String!) {
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

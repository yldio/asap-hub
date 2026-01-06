/* istanbul ignore file */

import { gql } from 'graphql-tag';

/**
 * Query to fetch all research tags with their utilisation counts across entities.
 * After running `yarn contentful:schema:update:crn`, this will generate
 * FetchTagsWithCountsQuery and FetchTagsWithCountsQueryVariables types.
 */
export const FETCH_TAGS_WITH_COUNTS = gql`
  query FetchTagsWithCounts($limit: Int, $skip: Int) {
    researchTagsCollection(limit: $limit, skip: $skip) {
      total
      items {
        sys {
          id
        }
        name
        category
        types
        linkedFrom {
          usersCollection(limit: 1) {
            total
          }
          eventsCollection(limit: 1) {
            total
          }
          teamsCollection(limit: 1) {
            total
          }
          workingGroupsCollection(limit: 1) {
            total
          }
          interestGroupsCollection(limit: 1) {
            total
          }
          projectsCollection(limit: 1) {
            total
          }
          newsCollection(limit: 1) {
            total
          }
          researchOutputsCollection(limit: 1) {
            total
          }
          tutorialsCollection(limit: 1) {
            total
          }
        }
      }
    }
  }
`;

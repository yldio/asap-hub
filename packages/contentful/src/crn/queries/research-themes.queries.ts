/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const researchThemesContentQueryFragment = gql`
  fragment ResearchThemesContent on ResearchTheme {
    sys {
      id
    }
    name
  }
`;

export const FETCH_RESEARCH_THEMES = gql`
  ${researchThemesContentQueryFragment}
  query FetchResearchThemes(
    $limit: Int
    $skip: Int
    $order: [ResearchThemeOrder]
  ) {
    researchThemeCollection(limit: $limit, skip: $skip, order: $order) {
      total
      items {
        ...ResearchThemesContent
      }
    }
  }
`;

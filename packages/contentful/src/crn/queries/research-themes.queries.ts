/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const researchThemesContentQueryFragment = gql`
  fragment ResearchThemesContent on ResearchTheme {
    sys {
      id
    }
    name
    types
  }
`;

export const FETCH_RESEARCH_THEMES = gql`
  ${researchThemesContentQueryFragment}
  query FetchResearchThemes(
    $limit: Int
    $skip: Int
    $order: [ResearchThemeOrder]
    $where: ResearchThemeFilter
  ) {
    researchThemeCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...ResearchThemesContent
      }
    }
  }
`;

import { gql } from 'graphql-tag';

export const workingGroupsContentQueryFragment = gql`
  fragment WorkingGroupsContent on WorkingGroups {
    id
    created
    lastModified
    version
    flatData {
      title
      description
      externalLink
      externalLinkText
    }
  }
`;

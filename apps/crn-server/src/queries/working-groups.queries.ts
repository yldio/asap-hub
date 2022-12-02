import gql from 'graphql-tag';

export const workingGroupContentQueryFragment = gql`
  fragment WorkingGroupContent on WorkingGroups {
    id
    lastModified
    flatData {
      title
      description
      externalLink
      shortText
      externalLinkText
      deliverables {
        status
        description
        user {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            biography
            degree
            email
            contactEmail
            firstName
            institution
            jobTitle
            lastModifiedDate
            lastName
            country
            city
            onboarded
            orcid
            orcidLastModifiedDate
            orcidLastSyncDate
            orcidWorks {
              doi
              id
              lastModifiedDate
              publicationDate
              title
              type
            }
            questions {
              question
            }
            expertiseAndResourceTags
            expertiseAndResourceDescription
            teams {
              role
              id {
                id
                flatData {
                  displayName
                  proposal {
                    id
                  }
                }
              }
            }
            social {
              github
              googleScholar
              linkedIn
              researcherId
              researchGate
              twitter
              website1
              website2
            }
            role
            responsibilities
            researchInterests
            reachOut
            labs {
              id
              flatData {
                name
              }
            }
            alumniSinceDate
          }
        }
      }
      members {
        workstreamRole
      }
      leaders {
        role
        workstreamRole
        user {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            biography
            degree
            email
            contactEmail
            firstName
            institution
            jobTitle
            lastModifiedDate
            lastName
            country
            city
            onboarded
            orcid
            orcidLastModifiedDate
            orcidLastSyncDate
            orcidWorks {
              doi
              id
              lastModifiedDate
              publicationDate
              title
              type
            }
            questions {
              question
            }
            expertiseAndResourceTags
            expertiseAndResourceDescription
            teams {
              role
              id {
                id
                flatData {
                  displayName
                  proposal {
                    id
                  }
                }
              }
            }
            social {
              github
              googleScholar
              linkedIn
              researcherId
              researchGate
              twitter
              website1
              website2
            }
            role
            responsibilities
            researchInterests
            reachOut
            labs {
              id
              flatData {
                name
              }
            }
            alumniSinceDate
          }
        }
      }
    }
  }
`;

export const FETCH_WORKING_GROUP = gql`
  query FetchWorkingGroup($id: String!) {
    findWorkingGroupsContent(id: $id) {
      ...WorkingGroupContent
    }
  }
  ${workingGroupContentQueryFragment}
`;

export const FETCH_WORKING_GROUPS = gql`
  query FetchWorkingGroups($top: Int, $skip: Int, $filter: String) {
    queryWorkingGroupsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/title/iv"
    ) {
      total
      items {
        ...WorkingGroupContent
      }
    }
  }
  ${workingGroupContentQueryFragment}
`;

/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      biography\n      degree\n      email\n      contactEmail\n      firstName\n      institution\n      jobTitle\n      lastModifiedDate\n      lastName\n      country\n      city\n      onboarded\n      orcid\n      orcidLastModifiedDate\n      orcidLastSyncDate\n      orcidWorks {\n        doi\n        id\n        lastModifiedDate\n        publicationDate\n        title\n        type\n      }\n      questions {\n        question\n      }\n      expertiseAndResourceTags\n      expertiseAndResourceDescription\n      social {\n        github\n        googleScholar\n        linkedIn\n        researcherId\n        researchGate\n        twitter\n        website1\n        website2\n      }\n      role\n      responsibilities\n      researchInterests\n      reachOut\n    }\n  }\n':
    graphql.UsersContentFragmentDoc,
  '\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n':
    graphql.FetchUserDocument,
  '\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n':
    graphql.FetchUsersDocument,
  '\n  fragment WorkingGroupContent on WorkingGroups {\n    id\n    flatData {\n      title\n      shortDescription\n      leadingMembers\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n':
    graphql.WorkingGroupContentFragmentDoc,
  '\n  query FetchWorkingGroup($id: String!) {\n    findWorkingGroupsContent(id: $id) {\n      ...WorkingGroupContent\n    }\n  }\n  \n':
    graphql.FetchWorkingGroupDocument,
  '\n  query FetchWorkingGroups {\n    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n':
    graphql.FetchWorkingGroupsDocument,
};

export function gql(
  source: '\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      biography\n      degree\n      email\n      contactEmail\n      firstName\n      institution\n      jobTitle\n      lastModifiedDate\n      lastName\n      country\n      city\n      onboarded\n      orcid\n      orcidLastModifiedDate\n      orcidLastSyncDate\n      orcidWorks {\n        doi\n        id\n        lastModifiedDate\n        publicationDate\n        title\n        type\n      }\n      questions {\n        question\n      }\n      expertiseAndResourceTags\n      expertiseAndResourceDescription\n      social {\n        github\n        googleScholar\n        linkedIn\n        researcherId\n        researchGate\n        twitter\n        website1\n        website2\n      }\n      role\n      responsibilities\n      researchInterests\n      reachOut\n    }\n  }\n',
): typeof documents['\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      biography\n      degree\n      email\n      contactEmail\n      firstName\n      institution\n      jobTitle\n      lastModifiedDate\n      lastName\n      country\n      city\n      onboarded\n      orcid\n      orcidLastModifiedDate\n      orcidLastSyncDate\n      orcidWorks {\n        doi\n        id\n        lastModifiedDate\n        publicationDate\n        title\n        type\n      }\n      questions {\n        question\n      }\n      expertiseAndResourceTags\n      expertiseAndResourceDescription\n      social {\n        github\n        googleScholar\n        linkedIn\n        researcherId\n        researchGate\n        twitter\n        website1\n        website2\n      }\n      role\n      responsibilities\n      researchInterests\n      reachOut\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment WorkingGroupContent on WorkingGroups {\n    id\n    flatData {\n      title\n      shortDescription\n      leadingMembers\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n',
): typeof documents['\n  fragment WorkingGroupContent on WorkingGroups {\n    id\n    flatData {\n      title\n      shortDescription\n      leadingMembers\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchWorkingGroup($id: String!) {\n    findWorkingGroupsContent(id: $id) {\n      ...WorkingGroupContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchWorkingGroup($id: String!) {\n    findWorkingGroupsContent(id: $id) {\n      ...WorkingGroupContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchWorkingGroups {\n    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchWorkingGroups {\n    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

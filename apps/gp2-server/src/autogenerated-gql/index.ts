/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  query FetchDashboard {\n    queryDashboardContents {\n      flatData {\n        news {\n          ...News\n        }\n        pages {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            path\n            title\n            shortText\n            text\n            link\n            linkText\n          }\n        }\n      }\n    }\n  }\n  \n':
    graphql.FetchDashboardDocument,
  '\n  fragment News on NewsAndEvents {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      title\n      shortText\n      text\n      type\n      thumbnail {\n        id\n      }\n      link\n      linkText\n    }\n  }\n':
    graphql.NewsFragmentDoc,
  '\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      biography\n      degree\n      email\n      contactEmail\n      firstName\n      institution\n      jobTitle\n      lastModifiedDate\n      lastName\n      country\n      city\n      onboarded\n      orcid\n      orcidLastModifiedDate\n      orcidLastSyncDate\n      orcidWorks {\n        doi\n        id\n        lastModifiedDate\n        publicationDate\n        title\n        type\n      }\n      questions {\n        question\n      }\n      expertiseAndResourceTags\n      expertiseAndResourceDescription\n      teams {\n        role\n        id {\n          id\n          flatData {\n            displayName\n            proposal {\n              id\n            }\n          }\n        }\n      }\n      social {\n        github\n        googleScholar\n        linkedIn\n        researcherId\n        researchGate\n        twitter\n        website1\n        website2\n      }\n      role\n      responsibilities\n      researchInterests\n      reachOut\n      labs {\n        id\n        flatData {\n          name\n        }\n      }\n    }\n  }\n':
    graphql.UsersContentFragmentDoc,
  '\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n':
    graphql.FetchUserDocument,
  '\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n':
    graphql.FetchUsersDocument,
};

export function gql(
  source: '\n  query FetchDashboard {\n    queryDashboardContents {\n      flatData {\n        news {\n          ...News\n        }\n        pages {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            path\n            title\n            shortText\n            text\n            link\n            linkText\n          }\n        }\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchDashboard {\n    queryDashboardContents {\n      flatData {\n        news {\n          ...News\n        }\n        pages {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            path\n            title\n            shortText\n            text\n            link\n            linkText\n          }\n        }\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment News on NewsAndEvents {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      title\n      shortText\n      text\n      type\n      thumbnail {\n        id\n      }\n      link\n      linkText\n    }\n  }\n',
): typeof documents['\n  fragment News on NewsAndEvents {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      title\n      shortText\n      text\n      type\n      thumbnail {\n        id\n      }\n      link\n      linkText\n    }\n  }\n'];
export function gql(
  source: '\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      biography\n      degree\n      email\n      contactEmail\n      firstName\n      institution\n      jobTitle\n      lastModifiedDate\n      lastName\n      country\n      city\n      onboarded\n      orcid\n      orcidLastModifiedDate\n      orcidLastSyncDate\n      orcidWorks {\n        doi\n        id\n        lastModifiedDate\n        publicationDate\n        title\n        type\n      }\n      questions {\n        question\n      }\n      expertiseAndResourceTags\n      expertiseAndResourceDescription\n      teams {\n        role\n        id {\n          id\n          flatData {\n            displayName\n            proposal {\n              id\n            }\n          }\n        }\n      }\n      social {\n        github\n        googleScholar\n        linkedIn\n        researcherId\n        researchGate\n        twitter\n        website1\n        website2\n      }\n      role\n      responsibilities\n      researchInterests\n      reachOut\n      labs {\n        id\n        flatData {\n          name\n        }\n      }\n    }\n  }\n',
): typeof documents['\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      biography\n      degree\n      email\n      contactEmail\n      firstName\n      institution\n      jobTitle\n      lastModifiedDate\n      lastName\n      country\n      city\n      onboarded\n      orcid\n      orcidLastModifiedDate\n      orcidLastSyncDate\n      orcidWorks {\n        doi\n        id\n        lastModifiedDate\n        publicationDate\n        title\n        type\n      }\n      questions {\n        question\n      }\n      expertiseAndResourceTags\n      expertiseAndResourceDescription\n      teams {\n        role\n        id {\n          id\n          flatData {\n            displayName\n            proposal {\n              id\n            }\n          }\n        }\n      }\n      social {\n        github\n        googleScholar\n        linkedIn\n        researcherId\n        researchGate\n        twitter\n        website1\n        website2\n      }\n      role\n      responsibilities\n      researchInterests\n      reachOut\n      labs {\n        id\n        flatData {\n          name\n        }\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

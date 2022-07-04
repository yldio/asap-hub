/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  query FetchDashboard {\n    queryDashboardContents {\n      flatData {\n        news {\n          ...News\n        }\n        pages {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            path\n            title\n            shortText\n            text\n            link\n            linkText\n          }\n        }\n      }\n    }\n  }\n  \n':
    graphql.FetchDashboardDocument,
  '\n  fragment News on NewsAndEvents {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      title\n      shortText\n      text\n      type\n      thumbnail {\n        id\n      }\n      link\n      linkText\n    }\n  }\n':
    graphql.NewsFragmentDoc,
};

export function gql(
  source: '\n  query FetchDashboard {\n    queryDashboardContents {\n      flatData {\n        news {\n          ...News\n        }\n        pages {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            path\n            title\n            shortText\n            text\n            link\n            linkText\n          }\n        }\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchDashboard {\n    queryDashboardContents {\n      flatData {\n        news {\n          ...News\n        }\n        pages {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            path\n            title\n            shortText\n            text\n            link\n            linkText\n          }\n        }\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment News on NewsAndEvents {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      title\n      shortText\n      text\n      type\n      thumbnail {\n        id\n      }\n      link\n      linkText\n    }\n  }\n',
): typeof documents['\n  fragment News on NewsAndEvents {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      title\n      shortText\n      text\n      type\n      thumbnail {\n        id\n      }\n      link\n      linkText\n    }\n  }\n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

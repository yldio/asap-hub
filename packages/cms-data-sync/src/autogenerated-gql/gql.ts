/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  query FetchNews {\n    queryNewsAndEventsContents(top: 100) {\n      id\n      flatData {\n        title\n        shortText\n        text\n        thumbnail {\n          id\n          fileName\n          thumbnailUrl\n          mimeType\n          fileType\n        }\n        frequency\n        link\n        linkText\n      }\n    }\n  }\n':
    graphql.FetchNewsDocument,
  '\n  query FetchPages {\n    queryPagesContents(top: 100) {\n      id\n      flatData {\n        title\n        path\n        shortText\n        text\n        link\n        linkText\n      }\n    }\n  }\n':
    graphql.FetchPagesDocument,
};

export function gql(
  source: '\n  query FetchNews {\n    queryNewsAndEventsContents(top: 100) {\n      id\n      flatData {\n        title\n        shortText\n        text\n        thumbnail {\n          id\n          fileName\n          thumbnailUrl\n          mimeType\n          fileType\n        }\n        frequency\n        link\n        linkText\n      }\n    }\n  }\n',
): typeof documents['\n  query FetchNews {\n    queryNewsAndEventsContents(top: 100) {\n      id\n      flatData {\n        title\n        shortText\n        text\n        thumbnail {\n          id\n          fileName\n          thumbnailUrl\n          mimeType\n          fileType\n        }\n        frequency\n        link\n        linkText\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchPages {\n    queryPagesContents(top: 100) {\n      id\n      flatData {\n        title\n        path\n        shortText\n        text\n        link\n        linkText\n      }\n    }\n  }\n',
): typeof documents['\n  query FetchPages {\n    queryPagesContents(top: 100) {\n      id\n      flatData {\n        title\n        path\n        shortText\n        text\n        link\n        linkText\n      }\n    }\n  }\n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

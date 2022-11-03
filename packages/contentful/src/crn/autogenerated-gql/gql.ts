/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query FetchNews($limit: Int, $skip: Int, $frequency: [String]) {\n    newsCollection(\n      limit: $limit\n      skip: $skip\n      where: { frequency_in: $frequency }\n      order: sys_firstPublishedAt_DESC\n    ) {\n      items {\n        sys {\n          firstPublishedAt\n        }\n        id\n        title\n        shortText\n        frequency\n        link\n        linkText\n        thumbnail {\n          url\n        }\n        text {\n          json\n        }\n      }\n    }\n  }\n": graphql.FetchNewsDocument,
};

export function gql(source: "\n  query FetchNews($limit: Int, $skip: Int, $frequency: [String]) {\n    newsCollection(\n      limit: $limit\n      skip: $skip\n      where: { frequency_in: $frequency }\n      order: sys_firstPublishedAt_DESC\n    ) {\n      items {\n        sys {\n          firstPublishedAt\n        }\n        id\n        title\n        shortText\n        frequency\n        link\n        linkText\n        thumbnail {\n          url\n        }\n        text {\n          json\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchNews($limit: Int, $skip: Int, $frequency: [String]) {\n    newsCollection(\n      limit: $limit\n      skip: $skip\n      where: { frequency_in: $frequency }\n      order: sys_firstPublishedAt_DESC\n    ) {\n      items {\n        sys {\n          firstPublishedAt\n        }\n        id\n        title\n        shortText\n        frequency\n        link\n        linkText\n        thumbnail {\n          url\n        }\n        text {\n          json\n        }\n      }\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
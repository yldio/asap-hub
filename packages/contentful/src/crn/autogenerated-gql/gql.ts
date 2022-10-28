/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query FetchNews {\n    newsCollection {\n      items {\n        title\n        shortText\n        frequency\n        externalLink\n        externalLinkText\n      }\n    }\n  }\n": graphql.FetchNewsDocument,
};

export function gql(source: "\n  query FetchNews {\n    newsCollection {\n      items {\n        title\n        shortText\n        frequency\n        externalLink\n        externalLinkText\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchNews {\n    newsCollection {\n      items {\n        title\n        shortText\n        frequency\n        externalLink\n        externalLinkText\n      }\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
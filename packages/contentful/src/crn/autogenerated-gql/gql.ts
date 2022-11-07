/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  fragment NewsContent on NewsCollection {\n    items {\n      sys {\n        firstPublishedAt\n      }\n      id\n      title\n      shortText\n      frequency\n      link\n      linkText\n      thumbnail {\n        url\n      }\n      text {\n        json\n      }\n    }\n  }\n": graphql.NewsContentFragmentDoc,
    "\n  query FetchNewsById($id: String!) {\n    newsCollection(where: { id: $id }) {\n      ...NewsContent\n    }\n  }\n  \n": graphql.FetchNewsByIdDocument,
    "\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      ...NewsContent\n    }\n  }\n  \n": graphql.FetchNewsDocument,
};

export function gql(source: "\n  fragment NewsContent on NewsCollection {\n    items {\n      sys {\n        firstPublishedAt\n      }\n      id\n      title\n      shortText\n      frequency\n      link\n      linkText\n      thumbnail {\n        url\n      }\n      text {\n        json\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment NewsContent on NewsCollection {\n    items {\n      sys {\n        firstPublishedAt\n      }\n      id\n      title\n      shortText\n      frequency\n      link\n      linkText\n      thumbnail {\n        url\n      }\n      text {\n        json\n      }\n    }\n  }\n"];
export function gql(source: "\n  query FetchNewsById($id: String!) {\n    newsCollection(where: { id: $id }) {\n      ...NewsContent\n    }\n  }\n  \n"): (typeof documents)["\n  query FetchNewsById($id: String!) {\n    newsCollection(where: { id: $id }) {\n      ...NewsContent\n    }\n  }\n  \n"];
export function gql(source: "\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      ...NewsContent\n    }\n  }\n  \n"): (typeof documents)["\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      ...NewsContent\n    }\n  }\n  \n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
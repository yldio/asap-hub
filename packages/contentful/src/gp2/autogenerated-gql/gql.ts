/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  fragment PageContent on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n':
    graphql.PageContentFragmentDoc,
  '\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContent\n      }\n    }\n  }\n  \n':
    graphql.FetchPagesDocument,
};

export function gql(
  source: '\n  fragment PageContent on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n',
): (typeof documents)['\n  fragment PageContent on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n'];
export function gql(
  source: '\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContent\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  fragment ContributingCohortsContentData on ContributingCohorts {\n    sys {\n      id\n    }\n    name\n  }\n':
    graphql.ContributingCohortsContentDataFragmentDoc,
  '\n  query FetchContributingCohorts(\n    $limit: Int\n    $skip: Int\n    $order: [ContributingCohortsOrder]\n  ) {\n    contributingCohortsCollection(limit: $limit, skip: $skip, order: $order) {\n      total\n      items {\n        ...ContributingCohortsContentData\n      }\n    }\n  }\n  \n':
    graphql.FetchContributingCohortsDocument,
  '\n  fragment NewsContentData on News {\n    sys {\n      id\n      firstPublishedAt\n    }\n    title\n    shortText\n    sampleCount\n    articleCount\n    cohortCount\n    link\n    linkText\n    publishDate\n  }\n':
    graphql.NewsContentDataFragmentDoc,
  '\n  query FetchNewsById($id: String!) {\n    news(id: $id) {\n      ...NewsContentData\n    }\n  }\n  \n':
    graphql.FetchNewsByIdDocument,
  '\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...NewsContentData\n      }\n    }\n  }\n  \n':
    graphql.FetchNewsDocument,
  '\n  fragment PageContentData on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n':
    graphql.PageContentDataFragmentDoc,
  '\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContentData\n      }\n    }\n  }\n  \n':
    graphql.FetchPagesDocument,
};

export function gql(
  source: '\n  fragment ContributingCohortsContentData on ContributingCohorts {\n    sys {\n      id\n    }\n    name\n  }\n',
): (typeof documents)['\n  fragment ContributingCohortsContentData on ContributingCohorts {\n    sys {\n      id\n    }\n    name\n  }\n'];
export function gql(
  source: '\n  query FetchContributingCohorts(\n    $limit: Int\n    $skip: Int\n    $order: [ContributingCohortsOrder]\n  ) {\n    contributingCohortsCollection(limit: $limit, skip: $skip, order: $order) {\n      total\n      items {\n        ...ContributingCohortsContentData\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchContributingCohorts(\n    $limit: Int\n    $skip: Int\n    $order: [ContributingCohortsOrder]\n  ) {\n    contributingCohortsCollection(limit: $limit, skip: $skip, order: $order) {\n      total\n      items {\n        ...ContributingCohortsContentData\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment NewsContentData on News {\n    sys {\n      id\n      firstPublishedAt\n    }\n    title\n    shortText\n    sampleCount\n    articleCount\n    cohortCount\n    link\n    linkText\n    publishDate\n  }\n',
): (typeof documents)['\n  fragment NewsContentData on News {\n    sys {\n      id\n      firstPublishedAt\n    }\n    title\n    shortText\n    sampleCount\n    articleCount\n    cohortCount\n    link\n    linkText\n    publishDate\n  }\n'];
export function gql(
  source: '\n  query FetchNewsById($id: String!) {\n    news(id: $id) {\n      ...NewsContentData\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchNewsById($id: String!) {\n    news(id: $id) {\n      ...NewsContentData\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...NewsContentData\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...NewsContentData\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment PageContentData on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n',
): (typeof documents)['\n  fragment PageContentData on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n'];
export function gql(
  source: '\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContentData\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContentData\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

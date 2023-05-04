/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  fragment CalendarsContentData on Calendars {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    googleCalendarId\n    name\n    color\n    syncToken\n    resourceId\n    expirationDate\n  }\n':
    graphql.CalendarsContentDataFragmentDoc,
  '\n  query FetchCalendarById($id: String!) {\n    calendars(id: $id) {\n      ...CalendarsContentData\n    }\n  }\n  \n':
    graphql.FetchCalendarByIdDocument,
  '\n  query FetchCalendars(\n    $limit: Int\n    $skip: Int\n    $order: [CalendarsOrder]\n    $where: CalendarsFilter\n  ) {\n    calendarsCollection(\n      limit: $limit\n      skip: $skip\n      order: $order\n      where: $where\n    ) {\n      total\n      items {\n        ...CalendarsContentData\n      }\n    }\n  }\n  \n':
    graphql.FetchCalendarsDocument,
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
  '\n  fragment UsersContent on Users {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    firstName\n    lastName\n    avatar {\n      url\n    }\n    degrees\n    country\n    city\n    region\n    email\n    alternativeEmail\n    telephoneCountryCode\n    telephoneNumber\n    keywords\n    biography\n    questions\n    fundingStreams\n    blog\n    linkedIn\n    twitter\n    github\n    googleScholar\n    orcid\n    researchGate\n    researcherId\n    connections\n    role\n    onboarded\n    activatedDate\n    contributingCohortsCollection(limit: 100) {\n      items {\n        contributingCohort {\n          sys {\n            id\n          }\n          name\n        }\n        role\n        studyLink\n      }\n    }\n    linkedFrom {\n      projectMembershipCollection(limit: 100) {\n        items {\n          user {\n            sys {\n              id\n            }\n          }\n          role\n          linkedFrom {\n            projectsCollection(limit: 1) {\n              items {\n                sys {\n                  id\n                }\n                title\n              }\n            }\n          }\n        }\n      }\n      workingGroupMembershipCollection(limit: 100) {\n        items {\n          user {\n            sys {\n              id\n            }\n          }\n          role\n          linkedFrom {\n            workingGroupsCollection(limit: 1) {\n              items {\n                sys {\n                  id\n                }\n                title\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    graphql.UsersContentFragmentDoc,
  '\n  query FetchUserById($id: String!) {\n    users(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n':
    graphql.FetchUserByIdDocument,
  '\n  query FetchUsers(\n    $limit: Int\n    $skip: Int\n    $order: [UsersOrder]\n    $where: UsersFilter\n  ) {\n    usersCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n':
    graphql.FetchUsersDocument,
};

export function gql(
  source: '\n  fragment CalendarsContentData on Calendars {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    googleCalendarId\n    name\n    color\n    syncToken\n    resourceId\n    expirationDate\n  }\n',
): (typeof documents)['\n  fragment CalendarsContentData on Calendars {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    googleCalendarId\n    name\n    color\n    syncToken\n    resourceId\n    expirationDate\n  }\n'];
export function gql(
  source: '\n  query FetchCalendarById($id: String!) {\n    calendars(id: $id) {\n      ...CalendarsContentData\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchCalendarById($id: String!) {\n    calendars(id: $id) {\n      ...CalendarsContentData\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchCalendars(\n    $limit: Int\n    $skip: Int\n    $order: [CalendarsOrder]\n    $where: CalendarsFilter\n  ) {\n    calendarsCollection(\n      limit: $limit\n      skip: $skip\n      order: $order\n      where: $where\n    ) {\n      total\n      items {\n        ...CalendarsContentData\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchCalendars(\n    $limit: Int\n    $skip: Int\n    $order: [CalendarsOrder]\n    $where: CalendarsFilter\n  ) {\n    calendarsCollection(\n      limit: $limit\n      skip: $skip\n      order: $order\n      where: $where\n    ) {\n      total\n      items {\n        ...CalendarsContentData\n      }\n    }\n  }\n  \n'];
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
export function gql(
  source: '\n  fragment UsersContent on Users {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    firstName\n    lastName\n    avatar {\n      url\n    }\n    degrees\n    country\n    city\n    region\n    email\n    alternativeEmail\n    telephoneCountryCode\n    telephoneNumber\n    keywords\n    biography\n    questions\n    fundingStreams\n    blog\n    linkedIn\n    twitter\n    github\n    googleScholar\n    orcid\n    researchGate\n    researcherId\n    connections\n    role\n    onboarded\n    activatedDate\n    contributingCohortsCollection(limit: 100) {\n      items {\n        contributingCohort {\n          sys {\n            id\n          }\n          name\n        }\n        role\n        studyLink\n      }\n    }\n    linkedFrom {\n      projectMembershipCollection(limit: 100) {\n        items {\n          user {\n            sys {\n              id\n            }\n          }\n          role\n          linkedFrom {\n            projectsCollection(limit: 1) {\n              items {\n                sys {\n                  id\n                }\n                title\n              }\n            }\n          }\n        }\n      }\n      workingGroupMembershipCollection(limit: 100) {\n        items {\n          user {\n            sys {\n              id\n            }\n          }\n          role\n          linkedFrom {\n            workingGroupsCollection(limit: 1) {\n              items {\n                sys {\n                  id\n                }\n                title\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  fragment UsersContent on Users {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    firstName\n    lastName\n    avatar {\n      url\n    }\n    degrees\n    country\n    city\n    region\n    email\n    alternativeEmail\n    telephoneCountryCode\n    telephoneNumber\n    keywords\n    biography\n    questions\n    fundingStreams\n    blog\n    linkedIn\n    twitter\n    github\n    googleScholar\n    orcid\n    researchGate\n    researcherId\n    connections\n    role\n    onboarded\n    activatedDate\n    contributingCohortsCollection(limit: 100) {\n      items {\n        contributingCohort {\n          sys {\n            id\n          }\n          name\n        }\n        role\n        studyLink\n      }\n    }\n    linkedFrom {\n      projectMembershipCollection(limit: 100) {\n        items {\n          user {\n            sys {\n              id\n            }\n          }\n          role\n          linkedFrom {\n            projectsCollection(limit: 1) {\n              items {\n                sys {\n                  id\n                }\n                title\n              }\n            }\n          }\n        }\n      }\n      workingGroupMembershipCollection(limit: 100) {\n        items {\n          user {\n            sys {\n              id\n            }\n          }\n          role\n          linkedFrom {\n            workingGroupsCollection(limit: 1) {\n              items {\n                sys {\n                  id\n                }\n                title\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchUserById($id: String!) {\n    users(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchUserById($id: String!) {\n    users(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchUsers(\n    $limit: Int\n    $skip: Int\n    $order: [UsersOrder]\n    $where: UsersFilter\n  ) {\n    usersCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchUsers(\n    $limit: Int\n    $skip: Int\n    $order: [UsersOrder]\n    $where: UsersFilter\n  ) {\n    usersCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

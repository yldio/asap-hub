/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  fragment CalendarsContent on Calendars {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    googleCalendarId\n    name\n    color\n    syncToken\n    resourceId\n    expirationDate\n  }\n':
    graphql.CalendarsContentFragmentDoc,
  '\n  query FetchCalendarById($id: String!) {\n    calendars(id: $id) {\n      ...CalendarsContent\n    }\n  }\n  \n':
    graphql.FetchCalendarByIdDocument,
  '\n  query FetchCalendars(\n    $limit: Int\n    $skip: Int\n    $order: [CalendarsOrder]\n    $where: CalendarsFilter\n  ) {\n    calendarsCollection(\n      limit: $limit\n      skip: $skip\n      order: $order\n      where: $where\n    ) {\n      total\n      items {\n        ...CalendarsContent\n      }\n    }\n  }\n  \n':
    graphql.FetchCalendarsDocument,
  '\n  query FetchDashboard {\n    dashboardCollection(limit: 1, order: sys_publishedAt_DESC) {\n      items {\n        newsCollection {\n          items {\n            ...NewsContent\n          }\n        }\n\n        pagesCollection {\n          items {\n            ...PageContent\n          }\n        }\n      }\n    }\n  }\n  \n  \n':
    graphql.FetchDashboardDocument,
  '\n  fragment ExternalAuthorsContent on ExternalAuthors {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    name\n    orcid\n  }\n':
    graphql.ExternalAuthorsContentFragmentDoc,
  '\n  query FetchExternalAuthorById($id: String!) {\n    externalAuthors(id: $id) {\n      ...ExternalAuthorsContent\n    }\n  }\n  \n':
    graphql.FetchExternalAuthorByIdDocument,
  '\n  query FetchExternalAuthors(\n    $limit: Int\n    $skip: Int\n    $order: [ExternalAuthorsOrder]\n  ) {\n    externalAuthorsCollection(limit: $limit, skip: $skip, order: $order) {\n      total\n      items {\n        ...ExternalAuthorsContent\n      }\n    }\n  }\n  \n':
    graphql.FetchExternalAuthorsDocument,
  '\n  fragment NewsContent on News {\n    sys {\n      id\n      firstPublishedAt\n    }\n    title\n    shortText\n    frequency\n    link\n    linkText\n    thumbnail {\n      url\n    }\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    publishDate\n  }\n':
    graphql.NewsContentFragmentDoc,
  '\n  query FetchNewsById($id: String!) {\n    news(id: $id) {\n      ...NewsContent\n    }\n  }\n  \n':
    graphql.FetchNewsByIdDocument,
  '\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...NewsContent\n      }\n    }\n  }\n  \n':
    graphql.FetchNewsDocument,
  '\n  fragment PageContent on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n':
    graphql.PageContentFragmentDoc,
  '\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContent\n      }\n    }\n  }\n  \n':
    graphql.FetchPagesDocument,
  '\n  fragment TeamsContent on Teams {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    displayName\n    applicationNumber\n    inactiveSince\n    projectSummary\n    projectTitle\n    expertiseAndResourceTags\n    toolsCollection {\n      items {\n        name\n        description\n        url\n      }\n    }\n  }\n':
    graphql.TeamsContentFragmentDoc,
  '\n  query FetchTeamById($id: String!) {\n    teams(id: $id) {\n      ...TeamsContent\n    }\n  }\n  \n':
    graphql.FetchTeamByIdDocument,
  '\n  query FetchTeams(\n    $limit: Int\n    $skip: Int\n    $order: [TeamsOrder]\n    $where: TeamsFilter\n  ) {\n    teamsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...TeamsContent\n      }\n    }\n  }\n  \n':
    graphql.FetchTeamsDocument,
};

export function gql(
  source: '\n  fragment CalendarsContent on Calendars {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    googleCalendarId\n    name\n    color\n    syncToken\n    resourceId\n    expirationDate\n  }\n',
): (typeof documents)['\n  fragment CalendarsContent on Calendars {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    googleCalendarId\n    name\n    color\n    syncToken\n    resourceId\n    expirationDate\n  }\n'];
export function gql(
  source: '\n  query FetchCalendarById($id: String!) {\n    calendars(id: $id) {\n      ...CalendarsContent\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchCalendarById($id: String!) {\n    calendars(id: $id) {\n      ...CalendarsContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchCalendars(\n    $limit: Int\n    $skip: Int\n    $order: [CalendarsOrder]\n    $where: CalendarsFilter\n  ) {\n    calendarsCollection(\n      limit: $limit\n      skip: $skip\n      order: $order\n      where: $where\n    ) {\n      total\n      items {\n        ...CalendarsContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchCalendars(\n    $limit: Int\n    $skip: Int\n    $order: [CalendarsOrder]\n    $where: CalendarsFilter\n  ) {\n    calendarsCollection(\n      limit: $limit\n      skip: $skip\n      order: $order\n      where: $where\n    ) {\n      total\n      items {\n        ...CalendarsContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchDashboard {\n    dashboardCollection(limit: 1, order: sys_publishedAt_DESC) {\n      items {\n        newsCollection {\n          items {\n            ...NewsContent\n          }\n        }\n\n        pagesCollection {\n          items {\n            ...PageContent\n          }\n        }\n      }\n    }\n  }\n  \n  \n',
): (typeof documents)['\n  query FetchDashboard {\n    dashboardCollection(limit: 1, order: sys_publishedAt_DESC) {\n      items {\n        newsCollection {\n          items {\n            ...NewsContent\n          }\n        }\n\n        pagesCollection {\n          items {\n            ...PageContent\n          }\n        }\n      }\n    }\n  }\n  \n  \n'];
export function gql(
  source: '\n  fragment ExternalAuthorsContent on ExternalAuthors {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    name\n    orcid\n  }\n',
): (typeof documents)['\n  fragment ExternalAuthorsContent on ExternalAuthors {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    name\n    orcid\n  }\n'];
export function gql(
  source: '\n  query FetchExternalAuthorById($id: String!) {\n    externalAuthors(id: $id) {\n      ...ExternalAuthorsContent\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchExternalAuthorById($id: String!) {\n    externalAuthors(id: $id) {\n      ...ExternalAuthorsContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchExternalAuthors(\n    $limit: Int\n    $skip: Int\n    $order: [ExternalAuthorsOrder]\n  ) {\n    externalAuthorsCollection(limit: $limit, skip: $skip, order: $order) {\n      total\n      items {\n        ...ExternalAuthorsContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchExternalAuthors(\n    $limit: Int\n    $skip: Int\n    $order: [ExternalAuthorsOrder]\n  ) {\n    externalAuthorsCollection(limit: $limit, skip: $skip, order: $order) {\n      total\n      items {\n        ...ExternalAuthorsContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment NewsContent on News {\n    sys {\n      id\n      firstPublishedAt\n    }\n    title\n    shortText\n    frequency\n    link\n    linkText\n    thumbnail {\n      url\n    }\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    publishDate\n  }\n',
): (typeof documents)['\n  fragment NewsContent on News {\n    sys {\n      id\n      firstPublishedAt\n    }\n    title\n    shortText\n    frequency\n    link\n    linkText\n    thumbnail {\n      url\n    }\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    publishDate\n  }\n'];
export function gql(
  source: '\n  query FetchNewsById($id: String!) {\n    news(id: $id) {\n      ...NewsContent\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchNewsById($id: String!) {\n    news(id: $id) {\n      ...NewsContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...NewsContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchNews(\n    $limit: Int\n    $skip: Int\n    $order: [NewsOrder]\n    $where: NewsFilter\n  ) {\n    newsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...NewsContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment PageContent on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n',
): (typeof documents)['\n  fragment PageContent on Pages {\n    sys {\n      id\n    }\n    title\n    path\n    shortText\n    text {\n      json\n      links {\n        entries {\n          inline {\n            sys {\n              id\n            }\n            __typename\n            ... on Media {\n              url\n            }\n          }\n        }\n        assets {\n          block {\n            sys {\n              id\n            }\n            url\n            description\n            contentType\n            width\n            height\n          }\n        }\n      }\n    }\n    link\n    linkText\n  }\n'];
export function gql(
  source: '\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchPages($where: PagesFilter) {\n    pagesCollection(limit: 100, where: $where) {\n      total\n      items {\n        ...PageContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment TeamsContent on Teams {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    displayName\n    applicationNumber\n    inactiveSince\n    projectSummary\n    projectTitle\n    expertiseAndResourceTags\n    toolsCollection {\n      items {\n        name\n        description\n        url\n      }\n    }\n  }\n',
): (typeof documents)['\n  fragment TeamsContent on Teams {\n    sys {\n      id\n      firstPublishedAt\n      publishedAt\n      publishedVersion\n    }\n    displayName\n    applicationNumber\n    inactiveSince\n    projectSummary\n    projectTitle\n    expertiseAndResourceTags\n    toolsCollection {\n      items {\n        name\n        description\n        url\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchTeamById($id: String!) {\n    teams(id: $id) {\n      ...TeamsContent\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchTeamById($id: String!) {\n    teams(id: $id) {\n      ...TeamsContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchTeams(\n    $limit: Int\n    $skip: Int\n    $order: [TeamsOrder]\n    $where: TeamsFilter\n  ) {\n    teamsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...TeamsContent\n      }\n    }\n  }\n  \n',
): (typeof documents)['\n  query FetchTeams(\n    $limit: Int\n    $skip: Int\n    $order: [TeamsOrder]\n    $where: TeamsFilter\n  ) {\n    teamsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {\n      total\n      items {\n        ...TeamsContent\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

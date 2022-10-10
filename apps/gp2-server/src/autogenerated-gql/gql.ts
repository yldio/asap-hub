/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
  '\n  fragment ProjectContent on Projects {\n    id\n    flatData {\n      title\n      startDate\n      endDate\n      status\n      projectProposal\n      description\n      pmEmail\n      leadEmail\n      keywords\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n      milestones {\n        title\n        description\n        status\n        link\n      }\n    }\n  }\n':
    graphql.ProjectContentFragmentDoc,
  '\n  query FetchProject($id: String!) {\n    findProjectsContent(id: $id) {\n      ...ProjectContent\n    }\n  }\n  \n':
    graphql.FetchProjectDocument,
  '\n  query FetchProjects {\n    queryProjectsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...ProjectContent\n      }\n    }\n  }\n  \n':
    graphql.FetchProjectsDocument,
  '\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      degree\n      email\n      firstName\n      lastName\n      region\n      role\n    }\n  }\n':
    graphql.UsersContentFragmentDoc,
  '\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n':
    graphql.FetchUserDocument,
  '\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n':
    graphql.FetchUsersDocument,
  '\n  fragment WorkingGroupNetworkContent on WorkingGroupNetwork {\n    id\n    flatData {\n      steeringCommitee {\n        ...WorkingGroupContent\n      }\n      complexDisease {\n        ...WorkingGroupContent\n      }\n      monogenic {\n        ...WorkingGroupContent\n      }\n      operational {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n':
    graphql.WorkingGroupNetworkContentFragmentDoc,
  '\n  query FetchWorkingGroupNetwork {\n    queryWorkingGroupNetworkContents {\n      ...WorkingGroupNetworkContent\n    }\n  }\n  \n':
    graphql.FetchWorkingGroupNetworkDocument,
  '\n  fragment WorkingGroupContent on WorkingGroups {\n    id\n    flatData {\n      title\n      shortDescription\n      leadingMembers\n      description\n      primaryEmail\n      secondaryEmail\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n':
    graphql.WorkingGroupContentFragmentDoc,
  '\n  query FetchWorkingGroup($id: String!) {\n    findWorkingGroupsContent(id: $id) {\n      ...WorkingGroupContent\n    }\n  }\n  \n':
    graphql.FetchWorkingGroupDocument,
  '\n  query FetchWorkingGroups {\n    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n':
    graphql.FetchWorkingGroupsDocument,
};

export function gql(
  source: '\n  fragment ProjectContent on Projects {\n    id\n    flatData {\n      title\n      startDate\n      endDate\n      status\n      projectProposal\n      description\n      pmEmail\n      leadEmail\n      keywords\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n      milestones {\n        title\n        description\n        status\n        link\n      }\n    }\n  }\n',
): typeof documents['\n  fragment ProjectContent on Projects {\n    id\n    flatData {\n      title\n      startDate\n      endDate\n      status\n      projectProposal\n      description\n      pmEmail\n      leadEmail\n      keywords\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n      milestones {\n        title\n        description\n        status\n        link\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchProject($id: String!) {\n    findProjectsContent(id: $id) {\n      ...ProjectContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchProject($id: String!) {\n    findProjectsContent(id: $id) {\n      ...ProjectContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchProjects {\n    queryProjectsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...ProjectContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchProjects {\n    queryProjectsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...ProjectContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      degree\n      email\n      firstName\n      lastName\n      region\n      role\n    }\n  }\n',
): typeof documents['\n  fragment UsersContent on Users {\n    id\n    created\n    lastModified\n    version\n    flatData {\n      avatar {\n        id\n      }\n      degree\n      email\n      firstName\n      lastName\n      region\n      role\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchUser($id: String!) {\n    findUsersContent(id: $id) {\n      ...UsersContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchUsers($top: Int, $skip: Int, $filter: String) {\n    queryUsersContentsWithTotal(\n      top: $top\n      skip: $skip\n      filter: $filter\n      orderby: "data/firstName/iv,data/lastName/iv"\n    ) {\n      total\n      items {\n        ...UsersContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment WorkingGroupNetworkContent on WorkingGroupNetwork {\n    id\n    flatData {\n      steeringCommitee {\n        ...WorkingGroupContent\n      }\n      complexDisease {\n        ...WorkingGroupContent\n      }\n      monogenic {\n        ...WorkingGroupContent\n      }\n      operational {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  fragment WorkingGroupNetworkContent on WorkingGroupNetwork {\n    id\n    flatData {\n      steeringCommitee {\n        ...WorkingGroupContent\n      }\n      complexDisease {\n        ...WorkingGroupContent\n      }\n      monogenic {\n        ...WorkingGroupContent\n      }\n      operational {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchWorkingGroupNetwork {\n    queryWorkingGroupNetworkContents {\n      ...WorkingGroupNetworkContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchWorkingGroupNetwork {\n    queryWorkingGroupNetworkContents {\n      ...WorkingGroupNetworkContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  fragment WorkingGroupContent on WorkingGroups {\n    id\n    flatData {\n      title\n      shortDescription\n      leadingMembers\n      description\n      primaryEmail\n      secondaryEmail\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n',
): typeof documents['\n  fragment WorkingGroupContent on WorkingGroups {\n    id\n    flatData {\n      title\n      shortDescription\n      leadingMembers\n      description\n      primaryEmail\n      secondaryEmail\n      members {\n        role\n        user {\n          id\n          created\n          lastModified\n          version\n          flatData {\n            avatar {\n              id\n            }\n            firstName\n            lastName\n          }\n        }\n      }\n    }\n  }\n'];
export function gql(
  source: '\n  query FetchWorkingGroup($id: String!) {\n    findWorkingGroupsContent(id: $id) {\n      ...WorkingGroupContent\n    }\n  }\n  \n',
): typeof documents['\n  query FetchWorkingGroup($id: String!) {\n    findWorkingGroupsContent(id: $id) {\n      ...WorkingGroupContent\n    }\n  }\n  \n'];
export function gql(
  source: '\n  query FetchWorkingGroups {\n    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n',
): typeof documents['\n  query FetchWorkingGroups {\n    queryWorkingGroupsContentsWithTotal(orderby: "created desc") {\n      total\n      items {\n        ...WorkingGroupContent\n      }\n    }\n  }\n  \n'];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

import {
  FetchManuscriptVersionByIdQuery,
  FetchManuscriptVersionByIdQueryVariables,
  FetchVersionsByManuscriptQuery,
  FetchVersionsByManuscriptQueryVariables,
  FETCH_MANUSCRIPT_VERSION_BY_ID,
  FETCH_VERSIONS_BY_MANUSCRIPT,
  GraphQLClient,
  ManuscriptsFilter,
} from '@asap-hub/contentful';
import {
  FetchOptions,
  ListManuscriptVersionResponse,
  ManuscriptVersionDataObject,
  ManuscriptVersionResponse,
} from '@asap-hub/model';
import { cleanArray } from '@asap-hub/server-common';

import { ManuscriptVersionDataProvider } from '../types';
import { getManuscriptVersionUID } from './manuscript.data-provider';

export class ManuscriptVersionContentfulDataProvider
  implements ManuscriptVersionDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchOptions<ManuscriptsFilter>,
  ): Promise<ListManuscriptVersionResponse> {
    const { take = 8, skip = 0, filter = {} } = options;

    const { manuscriptsCollection } = await this.contentfulClient.request<
      FetchVersionsByManuscriptQuery,
      FetchVersionsByManuscriptQueryVariables
    >(FETCH_VERSIONS_BY_MANUSCRIPT, {
      limit: take,
      skip,
      where: filter,
    });

    if (!manuscriptsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    const manuscriptVersions = cleanArray(manuscriptsCollection.items).reduce(
      (latestVersions: ManuscriptVersionResponse[], manuscript) => {
        const latestVersion = cleanArray(
          manuscript.versionsCollection?.items,
        ).find((version) =>
          [
            'Preprint',
            'Publication',
            'Publication with addendum or corrigendum',
          ].includes(version.lifecycle || ''),
        );
        if (latestVersion) {
          const team = manuscript?.teamsCollection?.items[0];
          return [
            ...latestVersions,
            {
              manuscriptId: getManuscriptVersionUID({
                version: {
                  type: latestVersion.type,
                  count: latestVersion.count,
                  lifecycle: latestVersion.lifecycle,
                },
                teamIdCode: team?.teamId || '',
                grantId: team?.grantId || '',
                manuscriptCount: manuscript.count || 0,
              }),
              linkedManuscriptId: manuscript.sys.id,
              title: manuscript.title || '',
              id: latestVersion.sys.id,
              type: latestVersion.type,
              lifecycle: latestVersion.lifecycle,
              teamId: team?.sys.id,
            } as ManuscriptVersionResponse,
          ];
        }
        return latestVersions;
      },
      [],
    );

    return {
      total: manuscriptsCollection.total,
      items: manuscriptVersions,
    };
  }

  async fetchById(id: string): Promise<ManuscriptVersionDataObject> {
    const { manuscriptVersions } = await this.contentfulClient.request<
      FetchManuscriptVersionByIdQuery,
      FetchManuscriptVersionByIdQueryVariables
    >(FETCH_MANUSCRIPT_VERSION_BY_ID, {
      id,
    });

    if (!manuscriptVersions) {
      return {
        versionFound: false,
      };
    }

    const manuscript =
      manuscriptVersions.linkedFrom?.manuscriptsCollection?.items[0];
    const validVersions = cleanArray(
      manuscript?.versionsCollection?.items,
    ).filter((version) =>
      [
        'Preprint',
        'Publication',
        'Publication with addendum or corrigendum',
      ].includes(version.lifecycle || ''),
    );

    if (manuscript && validVersions && validVersions[0]) {
      const team = manuscript?.teamsCollection?.items[0];
      const latestVersion = validVersions[0];
      const previousVersion = validVersions[1];
      return {
        versionFound: true,
        latestManuscriptVersion: {
          previousManuscriptVersionId: previousVersion
            ? previousVersion.sys.id
            : undefined,
          manuscriptId: getManuscriptVersionUID({
            version: {
              type: latestVersion.type,
              count: latestVersion.count,
              lifecycle: latestVersion.lifecycle,
            },
            teamIdCode: team?.teamId || '',
            grantId: team?.grantId || '',
            manuscriptCount: manuscript?.count || 0,
          }),
          linkedManuscriptId: manuscript.sys.id,
          title: manuscript?.title || '',
          id: latestVersion.sys.id,
          type: latestVersion.type,
          lifecycle: latestVersion.lifecycle,
          teamId: team?.sys.id,
        } as ManuscriptVersionResponse,
      };
    }
    return {
      versionFound: true,
    };
  }
}

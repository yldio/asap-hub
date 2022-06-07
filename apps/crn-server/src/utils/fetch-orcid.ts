import Got from 'got';
import get from 'lodash.get';
import { CMSOrcidWork } from '../data-providers/users.data-provider';

interface ORCIDExternalId {
  'external-id-type': string;
  'external-id-url': { value: string } | null;
  'external-id-value': string;
  'external-id-relationship': string;
}

interface ORCIDWork {
  'last-modified-date': { value: number };
  'external-ids': {
    'external-id': ORCIDExternalId[];
  };
  'work-summary': {
    'put-code': number;
    'created-date': { value: number };
    'last-modified-date': { value: number };
    source: Record<string, unknown>;
    title: {
      title: {
        value?: string;
      };
      subtitle: string | null;
      'translated-title': string | null;
    };
    'external-ids': {
      'external-id': ORCIDExternalId[];
    };
    type: string;
    'publication-date': {
      year: {
        value: string;
      };
      month: {
        value?: string;
      };
      day: {
        value?: string;
      } | null;
      'media-type': string | null;
    };
    visibility: string;
    path: string;
    'display-index': string;
  }[];
}

export interface ORCIDWorksResponse {
  'last-modified-date': { value: number };
  group: ORCIDWork[];
  path: string;
}

export const fetchOrcidProfile = (orcid: string): Promise<ORCIDWorksResponse> =>
  Got.get(`https://pub.orcid.org/v2.1/${orcid}/works`).json();

export const transformOrcidWorks = (
  orcidWorks: ORCIDWorksResponse,
): { lastModifiedDate: string; works: CMSOrcidWork[] } =>
  // parse & stringify to remove undefined values
  ({
    lastModifiedDate: `${orcidWorks['last-modified-date']?.value}`,
    works: orcidWorks.group.map((work) =>
      JSON.parse(
        JSON.stringify({
          doi: get(
            // get first external-id with url value
            get(work, 'external-ids.external-id', []).find(
              (e: ORCIDExternalId) => e['external-id-url']?.value,
            ),
            // return such value
            'external-id-url.value',
          ),
          id: `${get(work, '["work-summary"][0]["put-code"]')}`,
          title: get(work, '["work-summary"][0].title.title.value'),
          type: get(work, '["work-summary"][0].type'),
          publicationDate: {
            year: get(
              work,
              '["work-summary"][0]["publication-date"].year.value',
            ),
            month: get(
              work,
              '["work-summary"][0]["publication-date"].month.value',
            ),
            day: get(work, '["work-summary"][0]["publication-date"].day.value'),
          },
          lastModifiedDate: `${work['last-modified-date'].value}`,
        }),
      ),
    ),
  });

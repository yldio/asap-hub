import Got from 'got';

export interface ORCIDWorksResponse {
  'last-modified-date': { value: number };
  group: ORCIDWork[];
  path: string;
}

interface ORCIDExternalIds {
  'external-id': [
    {
      'external-id-type': string;
      'external-id-url': { value: string };
      'external-id-value': string;
      'external-id-relationship': string;
    },
  ];
}

interface ORCIDWork {
  'last-modified-date': { value: number };
  'external-ids': ORCIDExternalIds;
  'work-summary': {
    'put-code': number;
    'created-date': { value: number };
    'last-modified-date': { value: number };
    source: object;
    title: {
      title: {
        value?: string;
      };
      subtitle: string | null;
      'translated-title': string | null;
    };
    'external-ids': ORCIDExternalIds;
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

export const fetchOrcidProfile = (
  orcid: string,
): Promise<ORCIDWorksResponse> => {
  return Got.get(`https://pub.orcid.org/v2.1/${orcid}/works`).json();
};

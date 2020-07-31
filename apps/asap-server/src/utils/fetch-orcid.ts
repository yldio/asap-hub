import Got from 'got';

export interface ORCIDWorksResponse {
  'last-modified-date': { value: string };
  group: ORCIDWork[];
}

interface ORCIDWork {
  'last-modified-date': { value: string };
  'external-ids': {
    'external-id': [
      {
        'external-id-type': string;
        'external-id-url': { value: string };
      },
    ];
  };
  'work-summary': {
    'put-code': string;
    title: {
      title: {
        value?: string;
      };
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
      };
    };
  }[];
}

export const fetchOrcidProfile = (
  orcid: string,
): Promise<ORCIDWorksResponse> => {
  return Got.get(`https://pub.orcid.org/v2.1/${orcid}/works`).json();
};

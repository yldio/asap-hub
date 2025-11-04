import {
  ResearchOutputCreateDataObject,
  ResearchOutputDataObject,
  ResearchOutputUpdateDataObject,
  DataProvider,
  FetchOptions,
  ResearchOutputVersionPostRequest,
  ResearchOutputSharingStatus,
} from '@asap-hub/model';

export type FetchResearchOutputFilter = {
  documentType?: string | string[];
  title?: string;
  link?: string;
  relatedManuscriptVersion?: string;
  status?: string;
  teamId?: string;
  workingGroupId?: string;
  sharingStatus?: ResearchOutputSharingStatus;
  asapFunded?: 'Yes' | 'No' | 'Not Sure';
};

export type UpdateResearchOutputOptions = {
  publish: boolean;
  newVersion?: ResearchOutputVersionPostRequest;
};
export type CreateResearchOutputOptions = UpdateResearchOutputOptions;

export type FetchResearchOutputOptions =
  FetchOptions<FetchResearchOutputFilter> & {
    includeDrafts?: boolean;
    relatedResearchFilter?: {
      sharingStatus?: ResearchOutputSharingStatus;
      asapFunded?: 'Yes' | 'No' | 'Not Sure';
    };
  };

export type ResearchOutputDataProvider = DataProvider<
  ResearchOutputDataObject,
  ResearchOutputDataObject,
  FetchResearchOutputOptions,
  ResearchOutputCreateDataObject,
  CreateResearchOutputOptions,
  ResearchOutputUpdateDataObject,
  UpdateResearchOutputOptions
> & {
  fetchById: (
    id: string,
    filterRelatedResearch?: FetchResearchOutputOptions,
  ) => Promise<ResearchOutputDataObject | null>;
};

import {
  ResearchOutputCreateDataObject,
  ResearchOutputDataObject,
  ResearchOutputUpdateDataObject,
  DataProvider,
  FetchOptions,
  ResearchOutputVersionPostRequest,
  ResearchOutputSharingStatus,
} from '@asap-hub/model';

import { ResearchOutputFilter } from '../../utils/odata';

export type FetchResearchOutputFilter = ResearchOutputFilter & {
  status?: string;
  teamId?: string;
  workingGroupId?: string;
  documentType?: string | string[];
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
  };

export type ResearchOutputDataProvider = DataProvider<
  ResearchOutputDataObject,
  ResearchOutputDataObject,
  FetchResearchOutputOptions,
  ResearchOutputCreateDataObject,
  CreateResearchOutputOptions,
  ResearchOutputUpdateDataObject,
  UpdateResearchOutputOptions
>;

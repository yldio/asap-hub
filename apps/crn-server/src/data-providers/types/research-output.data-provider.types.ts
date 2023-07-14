import {
  ResearchOutputCreateDataObject,
  ResearchOutputDataObject,
  ResearchOutputUpdateDataObject,
  DataProvider,
  FetchOptions,
} from '@asap-hub/model';

import { ResearchOutputFilter } from '../../utils/odata';

export type FetchResearchOutputFilter = ResearchOutputFilter & {
  status?: string;
  teamId?: string;
  workingGroupId?: string;
  documentType?: string | string[];
};

export type UpdateResearchOutputOptions = { publish: boolean };
export type CreateResearchOutputOptions = UpdateResearchOutputOptions;

export type FetchResearchOutputOptions =
  FetchOptions<FetchResearchOutputFilter> & {
    includeDrafts?: boolean;
  };

export type ResearchOutputDataProvider = DataProvider<
  ResearchOutputDataObject,
  FetchResearchOutputOptions,
  ResearchOutputCreateDataObject,
  CreateResearchOutputOptions,
  ResearchOutputUpdateDataObject,
  UpdateResearchOutputOptions
>;

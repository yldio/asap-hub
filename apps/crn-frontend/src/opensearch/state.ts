import {
  atom,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import {
  searchCompliance,
  ComplianceSearchRequest,
  ComplianceSearchResponse,
} from './api';

export interface ComplianceSearchOptions {
  query: any; // Pre-built OpenSearch query
  size: number;
  from: number;
}

// Atom to trigger refresh of compliance data
export const refreshComplianceState = atom({
  key: 'refreshCompliance',
  default: 0,
});

// SelectorFamily that accepts ComplianceSearchOptions parameters
export const complianceSearchState = selectorFamily<
  ComplianceSearchResponse | undefined,
  Readonly<ComplianceSearchOptions>
>({
  key: 'complianceSearch',
  get:
    (options) =>
    async ({ get }) => {
      get(refreshComplianceState); // Subscribe to refresh trigger
      const authorization = get(authorizationState);

      // Build the complete OpenSearch request body (this is what gets sent to /_search)
      const searchRequest: ComplianceSearchRequest = {
        query: options.query,
        size: options.size,
        from: options.from,
      };

      try {
        return await searchCompliance(
          'compliance-data',
          searchRequest,
          authorization,
        );
      } catch (error) {
        console.error('Failed to fetch compliance data:', error);
        return undefined;
      }
    },
});

// Hook to use compliance search with pre-built query
export const useComplianceSearch = (
  options: ComplianceSearchOptions,
): ComplianceSearchResponse & {
  refresh: () => void;
  isLoading: boolean;
} => {
  const complianceData = useRecoilValue(complianceSearchState(options));
  const setRefresh = useSetRecoilState(refreshComplianceState);

  const refresh = () => {
    setRefresh((prev) => prev + 1);
  };

  // Return data with refresh and loading state
  return {
    total: complianceData?.total || 0,
    results: complianceData?.results || [],
    refresh,
    isLoading: complianceData === undefined,
  };
};

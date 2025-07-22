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
  updateCompliance,
} from './api';

export interface ComplianceSearchOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any; // Pre-built OpenSearch query
  size: number;
  from: number;
  sort: Array<Record<string, { order: 'desc' | 'asc' }>>;
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
        return undefined;
      }
    },
});

// Hook to use compliance search with pre-built query
export const useComplianceSearch = (
  options: ComplianceSearchOptions,
): ComplianceSearchResponse & {
  refresh: (manuscriptId: string) => Promise<void>;
  isLoading: boolean;
} => {
  const complianceData = useRecoilValue(complianceSearchState(options));
  const setRefresh = useSetRecoilState(refreshComplianceState);
  const authorization = useRecoilValue(authorizationState);
  const refresh = async (manuscriptId: string) => {
    try {
      await updateCompliance(
        'compliance-data',
        manuscriptId,
        {
          doc_as_upsert: false,
        },
        authorization,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error updating compliance', error);
    }
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

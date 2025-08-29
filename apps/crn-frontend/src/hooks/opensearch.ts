import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { OpensearchClient } from '../analytics/utils/opensearch';

export const useAnalyticsOpensearch = <T>(index: string) => {
  const authorization = useRecoilValue(authorizationState);
  const client = new OpensearchClient<T>(index, authorization);
  return {
    client,
  };
};

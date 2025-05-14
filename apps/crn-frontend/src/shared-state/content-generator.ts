import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getGeneratedShortDescription } from '../shared-api';

export const useGeneratedContent = () => {
  const authorization = useRecoilValue(authorizationState);

  return (description: string): Promise<string> =>
    getGeneratedShortDescription(description, authorization).then(
      ({ shortDescription }) => shortDescription || '',
    );
};

import { useAuthorization } from '../auth/useAuthorization';
import { getGeneratedShortDescription } from '../shared-api';

export const useGeneratedContent = () => {
  const getAuthorization = useAuthorization();

  return async (description: string): Promise<string> =>
    getGeneratedShortDescription(description, await getAuthorization()).then(
      ({ shortDescription }) => shortDescription || '',
    );
};

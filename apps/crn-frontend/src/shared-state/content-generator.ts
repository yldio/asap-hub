import { useAuth0CRN } from '@asap-hub/react-context';
import { getGeneratedShortDescription } from '../shared-api';

export const useGeneratedContent = () => {
  const auth0 = useAuth0CRN();

  return async (description: string): Promise<string> => {
    const token = await auth0.getTokenSilently();
    const { shortDescription } = await getGeneratedShortDescription(
      description,
      `Bearer ${token}`,
    );
    return shortDescription || '';
  };
};

import { generateContent } from '@asap-hub/frontend-utils';
import { ContentGeneratorResponse } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getGeneratedShortDescription = async (
  description: string,
  authorization: string,
): Promise<ContentGeneratorResponse> => {
  const apiUrl = `${API_BASE_URL}/generate-content`;

  return generateContent(description, apiUrl, authorization, 'CRN');
};

import { ResearchOutputResponse } from '@asap-hub/model';

type Version = Pick<
  ResearchOutputResponse,
  'documentType' | 'type' | 'title' | 'id' | 'addedDate' | 'link'
>;

const versionResponse: Version = {
  addedDate: '2020-10-08T16:35:54Z',
  id: 'version1',
  title: 'A version',
  documentType: 'Article',
  type: 'Preprint',
  link: 'https://test.com',
};

export const createVersionResponse = (itemIndex = 0) => ({
  ...versionResponse,
  id: `version${itemIndex}`,
  title: `${versionResponse} ${itemIndex + 1}`,
});

export const createVersionList = (length: number): Version[] =>
  Array.from({ length }, (_, itemIndex) => createVersionResponse(itemIndex));

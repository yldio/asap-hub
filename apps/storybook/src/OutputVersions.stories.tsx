import { ResearchOutputResponse } from '@asap-hub/model';
import { OutputVersions } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / OutputVersions',
  component: OutputVersions,
  decorators: [NoPaddingDecorator],
};
const versions: Pick<
  ResearchOutputResponse,
  'documentType' | 'type' | 'title' | 'id' | 'publishDate'
>[] = [
  {
    documentType: 'Article',
    type: 'Preprint',
    title: 'A title',
    id: '1',
    publishDate: '2023-06-25T16:58:41.000Z',
  },
  {
    documentType: 'Article',
    type: 'Preprint',
    title: 'A title',
    id: '2',
    publishDate: '2023-07-25T16:58:41.000Z',
  },
];
export const Normal = () => <OutputVersions versions={versions} />;

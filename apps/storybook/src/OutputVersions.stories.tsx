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
  'documentType' | 'type' | 'title' | 'id' | 'addedDate' | 'link'
>[] = [
  {
    documentType: 'Article',
    type: 'Preprint',
    title: 'A title',
    id: '1',
    addedDate: '2023-06-25T16:58:41.000Z',
    link: 'https://foo.com',
  },
  {
    documentType: 'Article',
    type: 'Preprint',
    title: 'A title',
    id: '2',
    addedDate: '2023-07-25T16:58:41.000Z',
    link: 'https://foo.com',
  },
];
export const Normal = () => <OutputVersions versions={versions} />;

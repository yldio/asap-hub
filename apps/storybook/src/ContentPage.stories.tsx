import { ContentPage } from '@asap-hub/react-components';
import { text } from './knobs';

export default {
  title: 'Templates / Content Page',
  component: ContentPage,
};

export const Normal = () => (
  <ContentPage
    title={text('Title', 'Title')}
    text={text('Text', '<b>Hello</b>')}
  />
);

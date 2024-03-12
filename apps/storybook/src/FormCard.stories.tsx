import { FormCard } from '@asap-hub/react-components';
import { text } from './knobs';

export default {
  title: 'Molecules / Form Card',
};

export const Normal = () => (
  <FormCard title={text('Title', 'What are you sharing?')}>
    Card content
  </FormCard>
);

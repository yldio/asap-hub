import { ExternalLink } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Molecules / External Link',
  component: ExternalLink,
};

export const Normal = () => (
  <ExternalLink
    href={text('href', 'http://example.com')}
    label={text('Label', 'External Link')}
  />
);

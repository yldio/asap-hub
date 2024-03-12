import { text } from './knobs';

import { PageCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Page Card',
};

export const Normal = () => (
  <PageCard
    id="uuid"
    title={text('Title', 'Welcome Package')}
    text={text('Text', '')}
    shortText={text(
      'Short Text',
      "Find your way around the grant, ASAP's way of working, the deadlines and what is expected of grantees. Open to read the Welcome Package",
    )}
    link="#"
    linkText={text('Link Text', '')}
  />
);

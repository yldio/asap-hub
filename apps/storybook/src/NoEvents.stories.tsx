import { ComponentProps } from 'react';
import { NoEvents } from '@asap-hub/react-components';

import { boolean, select } from './knobs';

export default {
  title: 'Organisms / No Events',
};

const props = (): ComponentProps<typeof NoEvents> => {
  const past = boolean('Past Event', true);
  const link = '';
  const type = select(
    'Type',
    ['team', 'interest group', 'working group', 'member'],
    'team',
  );

  return {
    past,
    link,
    type,
  };
};

export const Normal = () => <NoEvents {...props()} />;

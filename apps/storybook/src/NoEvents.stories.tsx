import { ComponentProps } from 'react';
import { boolean, select } from '@storybook/addon-knobs';
import { NoEvents } from '@asap-hub/react-components';

export default {
  title: 'Organisms / No Events',
};

const props = (): ComponentProps<typeof NoEvents> => {
  const displayName = 'ASAP Team';
  const past = boolean('Past Event', true);
  const link = '';
  const type = select('Type', ['team', 'group'], 'team');

  return {
    displayName,
    past,
    link,
    type,
  };
};

export const Normal = () => <NoEvents {...props()} />;

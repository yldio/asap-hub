import React, { ComponentProps } from 'react';
import { EventInfo } from '@asap-hub/react-components';
import { number, text, boolean } from '@storybook/addon-knobs';
import { createEventResponse } from '@asap-hub/fixtures';

import { CenterDecorator } from './layout';

export default {
  title: 'Molecules / Events / Info',
  component: EventInfo,
  decorators: [CenterDecorator],
};

const props = (): ComponentProps<typeof EventInfo> => ({
  ...createEventResponse(),
  groups: createEventResponse({
    groupCount: number('Group Count', 1),
  }).groups.map((group) => ({ ...group, href: '#' })),
  thumbnail: text('Thumbnail', 'https://placekitten.com/150/150'),
  title: text('Title', 'GBA/LRRK2 Convergence workshops'),
  titleLimit: boolean('Title unlimited', false) ? null : undefined,
});

export const Normal = () => <EventInfo {...props()} />;

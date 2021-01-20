import React from 'react';
import { text } from '@storybook/addon-knobs';

import { CalendarLink } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Calendar Link',
  component: CalendarLink,
};

export const Normal = () => (
  <CalendarLink id={text('Calendar Id', 'hub@asap.science')} />
);

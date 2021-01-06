import React from 'react';

import { CalendarList } from '@asap-hub/react-components';
import { color, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisims / Calendar List',
  component: CalendarList,
};
// number('Items', 3, { min :0, max: 10})
export const Normal = () => (
  <CalendarList
    calendars={[
      {
        colour: color('color', 'red', '1'),
        id: '123',
        name: text('name', 'ASAP Calendar', '1'),
      },
      {
        colour: color('color', 'blue', '2'),
        id: '234',
        name: text('name', 'Sci 1 - GWAS Functional', '2'),
      },
      {
        colour: color('color', 'green', '3'),
        id: '456',
        name: text('name 3', 'Sci 2 - Aging and Progression', '3'),
      },
    ]}
  />
);

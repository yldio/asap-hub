import { CalendarLink } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Molecules / Calendar Link',
  component: CalendarLink,
};

export const Normal = () => (
  <CalendarLink id={text('Calendar Id', 'hub@asap.science')} />
);

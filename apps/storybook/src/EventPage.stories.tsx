import { EventPage } from '@asap-hub/react-components';
import { createEventResponse } from '@asap-hub/fixtures';
import { boolean } from '@storybook/addon-knobs';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Events / Detail Page',
  component: EventPage,
  decorators: [LayoutDecorator],
};

export const Normal = () => (
  <EventPage
    {...createEventResponse()}
    backHref="#"
    hideMeetingLink={boolean('Hide Meeting Link', false)}
  />
);

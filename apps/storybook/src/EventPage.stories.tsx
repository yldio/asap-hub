import { EventPage, getIconForDocumentType } from '@asap-hub/react-components';
import { createEventResponse } from '@asap-hub/fixtures';
import { boolean, number } from '@storybook/addon-knobs';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Events / Detail Page',
  component: EventPage,
  decorators: [LayoutDecorator],
};

export const Normal = () => (
  <EventPage
    {...createEventResponse({
      numberOfSpeakers: number('Number of speakers', 4),
      numberOfUnknownSpeakers: number('Number of unknown speakers', 2),
      numberOfExternalSpeakers: number('Number of external speakers', 0),
      isEventInThePast: boolean('Has the event passed', false),
    })}
    tags={[]}
    backHref="#"
    hideMeetingLink={boolean('Hide Meeting Link', false)}
    eventOwner={<div>ASAP Team</div>}
    displayCalendar={boolean('display calendar', true)}
    getIconForDocumentType={() => getIconForDocumentType('Article')}
  />
);

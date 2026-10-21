import { css } from '@emotion/react';
import { BasicCalendarResponse } from '@asap-hub/model';

import { Link, Paragraph } from '../atoms';
import { InterestGroupsIcon, WorkingGroupsIcon } from '../icons';
import { createMailTo, TECH_SUPPORT_EMAIL } from '../mail';
import { CtaCard } from '../molecules';
import { CalendarHubUpdates, CalendarList } from '../organisms';
import { rem } from '../pixels';

const containerStyles = css({
  display: 'grid',
  gridRowGap: rem(32),
});

type CalendarWithLink = BasicCalendarResponse & { href?: string };

type SubscribeToCalendarsPageProps = {
  hubCalendar?: BasicCalendarResponse;
  interestGroupCalendars: ReadonlyArray<CalendarWithLink>;
  workingGroupCalendars: ReadonlyArray<CalendarWithLink>;
  seminarSeriesCalendars: ReadonlyArray<BasicCalendarResponse>;
};

const SubscribeToCalendarsPage: React.FC<SubscribeToCalendarsPageProps> = ({
  hubCalendar,
  interestGroupCalendars,
  workingGroupCalendars,
  seminarSeriesCalendars,
}) => (
  <div css={containerStyles}>
    <CalendarHubUpdates calendar={hubCalendar} />
    <CalendarList
      title="Interest Groups"
      emptyMessage="No Interest Groups are scheduled to present yet. Once one is, you can subscribe to it here."
      description="Below you can find a list of all the Interest Groups that will present in the future. Hitting subscribe will allow you to add them to your own personal calendar."
      calendars={interestGroupCalendars}
      icon={<InterestGroupsIcon />}
      hideCalendarColour
      hideSupportText
    />
    <CalendarList
      title="Working Groups"
      emptyMessage="No Working Groups are scheduled to present yet. Once one is, you can subscribe to it here."
      description="Below you can find a list of all the Working Groups that will present in the future. Hitting subscribe will allow you to add them to your own personal calendar."
      calendars={workingGroupCalendars}
      icon={<WorkingGroupsIcon />}
      hideCalendarColour
      hideSupportText
    />
    <CalendarList
      title="Seminar Series"
      emptyMessage="No Seminar Series are scheduled yet. Once one is, you can subscribe to it here."
      description="Below you can find a list of all the Seminar Series that will present in the future. These are public, so anyone can attend. Hitting subscribe will allow you to add them to your own personal calendar."
      calendars={seminarSeriesCalendars}
      hideCalendarColour
      hideSupportText
    />
    <Paragraph noMargin>
      Set up your calendar manually with these instructions for{' '}
      <Link href="https://support.apple.com/en-us/guide/calendar/icl1022/mac">
        Apple Calendar
      </Link>{' '}
      or{' '}
      <Link href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c">
        Outlook
      </Link>
      .
    </Paragraph>
    <CtaCard
      href={createMailTo(TECH_SUPPORT_EMAIL)}
      buttonText="Contact Tech Support"
      displayCopy
    >
      <strong>Having trouble accessing an event?</strong>
      <br /> The tech support team is here to help.
    </CtaCard>
  </div>
);

export default SubscribeToCalendarsPage;

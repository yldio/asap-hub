import { css } from '@emotion/react';
import { EventResponse } from '@asap-hub/model';

import { formatDateToTimezone } from '../date';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { calendarIcon, clockIcon } from '../icons';

import { Info } from '.';

const listStyles = css({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
});

const listItemStyles = css({
  color: lead.rgb,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: `${7.5 / perRem}em`,
});

const iconStyles = css({
  paddingRight: `${9 / perRem}em`,
  lineHeight: 0,
  height: 'fit-content',
});

const tzStyles = css({
  paddingLeft: `${9 / perRem}em`,
});

type EventTimeProps = Pick<
  EventResponse,
  'startDate' | 'startDateTimeZone' | 'endDate' | 'endDateTimeZone'
>;
const EventTime: React.FC<EventTimeProps> = ({
  startDate,
  startDateTimeZone,
  endDate,
  endDateTimeZone,
}) => {
  const formattedStartDay = formatDateToTimezone(
    startDate,
    'E, d MMM y',
  ).toUpperCase();
  const formattedEndDay = formatDateToTimezone(
    endDate,
    'E, d MMM y',
  ).toUpperCase();

  const formattedStartDateTimeZone = formatDateToTimezone(
    startDate,
    ' z (zzzz)',
    startDateTimeZone,
  );
  const formattedEndDateTimeZone = formatDateToTimezone(
    endDate,
    ' z (zzzz)',
    endDateTimeZone,
  );

  return (
    <ul css={listStyles}>
      <li css={listItemStyles}>
        <div css={iconStyles}>{calendarIcon}</div>
        {formattedStartDay}
      </li>
      <li css={listItemStyles}>
        <div css={iconStyles}>{clockIcon}</div>
        {formatDateToTimezone(startDate, 'h:mm a')} -{' '}
        {formatDateToTimezone(endDate, 'h:mm a (z)').toUpperCase()}
        {formattedEndDay !== formattedStartDay && ` - ${formattedEndDay} ∙ `}
        <div css={tzStyles}>
          <Info>
            The meeting is at{' '}
            {formatDateToTimezone(startDate, 'h:mm a', startDateTimeZone)}
            {formattedStartDateTimeZone !== formattedEndDateTimeZone &&
              formattedStartDateTimeZone}
            {' - '}
            {formatDateToTimezone(endDate, 'h:mm a', endDateTimeZone)}
            {formattedEndDateTimeZone}. It is converted to your time zone for
            your convenience.
          </Info>
        </div>
      </li>
    </ul>
  );
};

export default EventTime;

import React from 'react';
import css from '@emotion/css';
import { EventResponse } from '@asap-hub/model';

import { formatDateToTimezone } from '../date';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { Info } from '.';

const styles = css({
  color: lead.rgb,
  display: 'flex',
  flexWrap: 'wrap',
});
const tzStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  columnGap: `${12 / perRem}em`,
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
    <div css={styles}>
      <div css={{ whiteSpace: 'pre' }}>{formattedStartDay} ∙ </div>
      <div css={{ whiteSpace: 'pre' }}>
        {formatDateToTimezone(startDate, 'h:mm a')} -{' '}
      </div>
      <div css={{ whiteSpace: 'pre' }}>
        {formattedEndDay !== formattedStartDay && `${formattedEndDay} ∙ `}
      </div>
      <div css={tzStyles}>
        <div css={{ whiteSpace: 'pre' }}>
          {formatDateToTimezone(endDate, 'h:mm a (z)').toUpperCase()}
        </div>
        <Info>
          The meeting is at{' '}
          {formatDateToTimezone(startDate, 'h:mm a', startDateTimeZone)}
          {formattedStartDateTimeZone !== formattedEndDateTimeZone &&
            formattedStartDateTimeZone}
          {' - '}
          {formatDateToTimezone(endDate, 'h:mm a', endDateTimeZone)}
          {formattedEndDateTimeZone}. It is converted to your time zone for your
          convenience.
        </Info>
      </div>
    </div>
  );
};

export default EventTime;

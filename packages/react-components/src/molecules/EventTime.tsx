import { css } from '@emotion/react';
import { EventResponse } from '@asap-hub/model';

import { formatDateToTimezone } from '../date';
import { info100, info500, lead } from '../colors';
import { rem } from '../pixels';
import { calendarIcon, clockIcon, infoInfoIcon } from '../icons';

import { Info } from '.';

const listStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  margin: 0,
  padding: 0,
});

const listItemStyles = css({
  color: lead.rgb,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const iconStyles = css({
  paddingRight: rem(8),
  lineHeight: 0,
  height: 'fit-content',
});

const dateStyles = css({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const tzStyles = css({
  paddingLeft: rem(8),
});

const recurrentPillStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(4),
  flexShrink: 0,
  marginLeft: 'auto',

  backgroundColor: info100.rgb,
  color: info500.rgb,
  borderRadius: rem(36),
  padding: `${rem(4)} ${rem(8)} ${rem(4)} ${rem(16)}`,

  button: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',

    // stretch the tooltip positioner across the button so the
    // bubble centers on the icon instead of the button's left edge
    '> span:first-of-type': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
  },

  svg: {
    width: rem(16),
    height: rem(16),
    display: 'block',
  },
});

type EventTimeProps = Pick<
  EventResponse,
  | 'startDate'
  | 'startDateTimeZone'
  | 'endDate'
  | 'endDateTimeZone'
  | 'recurring'
>;
const EventTime: React.FC<EventTimeProps> = ({
  startDate,
  startDateTimeZone,
  endDate,
  endDateTimeZone,
  recurring,
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
        <span css={dateStyles}>{formattedStartDay}</span>
        {recurring && (
          <span css={recurrentPillStyles}>
            <small>Recurrent</small>
            <Info icon={infoInfoIcon}>
              This event is part of a recurring series. Each occurrence is
              listed separately.
            </Info>
          </span>
        )}
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

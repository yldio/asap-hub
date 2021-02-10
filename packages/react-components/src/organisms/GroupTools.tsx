import React from 'react';
import css from '@emotion/css';
import { GroupResponse } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Link } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { slackIcon, googleDriveIcon } from '../icons';
import { CalendarLink } from '../molecules';

const BUTTON_SPACING = 12 / perRem;
const buttons = css({
  display: 'flex',
  flexFlow: 'wrap',
  width: `calc(100% + ${BUTTON_SPACING}em)`,
  listStyle: 'none',
  margin: `${12 / perRem}em 0 0 0`,
  padding: 0,
});

const button = css({
  display: 'flex',
  marginRight: `${BUTTON_SPACING}em`,
  flexGrow: 1,

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexGrow: 0,
  },
});

type GroupToolsProps = Pick<GroupResponse, 'tools'> & {
  readonly calendarId?: GroupResponse['calendars'][0]['id'];
};

const GroupTools: React.FC<GroupToolsProps> = ({
  calendarId,
  tools: { slack, googleDrive },
}) => (
  <Card>
    <Headline3>Group Tools</Headline3>
    <Paragraph accent="lead">
      You can join the group’s Slack channel to chat with other members or
      explore the group’s private and secure Google Drive.
    </Paragraph>
    <ul css={buttons}>
      {slack && (
        <li css={button}>
          <Link href={slack} buttonStyle small>
            {slackIcon} Join Slack Channel
          </Link>
        </li>
      )}
      {googleDrive && (
        <li css={button}>
          <Link href={googleDrive} buttonStyle small>
            {googleDriveIcon} Access Google Drive
          </Link>
        </li>
      )}
      {calendarId && (
        <li css={button}>
          <CalendarLink id={calendarId}>Subscribe to Calendar</CalendarLink>
        </li>
      )}
    </ul>
  </Card>
);

export default GroupTools;

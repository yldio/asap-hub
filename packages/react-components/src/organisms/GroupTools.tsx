import React from 'react';
import css from '@emotion/css';
import { GroupResponse } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Link } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { slackIcon, googleDriveIcon, googleCalendarIcon } from '../icons';

const BUTTON_SPACING = 28 / perRem;
const buttons = css({
  display: 'flex',
  flexFlow: 'wrap',
  width: `calc(100% + ${BUTTON_SPACING}em)`,
  listStyle: 'none',
  margin: `${18 / perRem}em 0 0 0`,
  padding: 0,
});

const button = css({
  display: 'flex',
  marginRight: `${BUTTON_SPACING}em`,
  marginTop: `-${18 / perRem}em`,
  flexGrow: 1,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexGrow: 0,
  },
});

type GroupToolsProps = Pick<GroupResponse, 'tools'>;

const GroupTools: React.FC<GroupToolsProps> = ({
  tools: { googleCalendar, slack, googleDrive },
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
          <Link href={slack} buttonStyle>
            {slackIcon} Join Slack Channel
          </Link>
        </li>
      )}
      {googleDrive && (
        <li css={button}>
          <Link href={googleDrive} buttonStyle>
            {googleDriveIcon} Access Google Drive
          </Link>
        </li>
      )}
      {googleCalendar && (
        <li css={button}>
          <Link href={googleCalendar} buttonStyle>
            {googleCalendarIcon} Subscribe to Google Calendar
          </Link>
        </li>
      )}
    </ul>
  </Card>
);

export default GroupTools;

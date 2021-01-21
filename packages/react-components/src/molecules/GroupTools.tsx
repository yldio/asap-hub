import React from 'react';
import css from '@emotion/css';
import { GroupResponse } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Link } from '../atoms';
import { getIconFromUrl } from '../utils';
import { perRem } from '../pixels';

const BUTTON_SPACING = 28 / perRem;
const buttons = css({
  display: 'flex',
  flexFlow: 'wrap',
  marginTop: `${18 / perRem}em`,
  width: `calc(100% + ${BUTTON_SPACING}em)`,
  marginRight: `-${BUTTON_SPACING}em`,
  '> a': {
    marginRight: `${BUTTON_SPACING}em`,
    marginTop: 0,
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
    <div css={buttons}>
      {slack && (
        <Link href={slack} buttonStyle>
          {getIconFromUrl(slack)} Join Slack Channel
        </Link>
      )}
      {googleDrive && (
        <Link href={googleDrive} buttonStyle>
          {getIconFromUrl(googleDrive)} Access Google Drive
        </Link>
      )}
      {googleCalendar && (
        <Link href={googleCalendar} buttonStyle>
          {getIconFromUrl(googleCalendar)} Subscribe to Google Calendar
        </Link>
      )}
    </div>
  </Card>
);

export default GroupTools;

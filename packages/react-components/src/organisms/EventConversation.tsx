import { css } from '@emotion/react';
import { EventResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Headline3, Paragraph, Link } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { slackIcon } from '../icons';

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

type EventConversationProps = Pick<EventResponse, 'interestGroup'>;

const EventConversation: React.FC<EventConversationProps> = ({
  interestGroup: { id, tools: { slack } } = { tools: {} },
}) =>
  id && slack ? (
    <Card>
      <Headline3>Continue the conversation</Headline3>
      <Paragraph accent="lead">
        You can join this group’s Slack channel to chat with other members or
        explore the group’s page.
      </Paragraph>
      <ul css={buttons}>
        <li css={button}>
          <Link href={slack} buttonStyle small>
            {slackIcon} Join Slack Channel
          </Link>
        </li>
        <li css={button}>
          <Link
            href={
              network({})
                .interestGroups({})
                .interestGroup({ interestGroupId: id }).$
            }
            buttonStyle
            small
          >
            View Group Page
          </Link>
        </li>
      </ul>
    </Card>
  ) : null;

export default EventConversation;

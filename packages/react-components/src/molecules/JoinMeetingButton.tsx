import { css } from '@emotion/react';
import { urlExpression } from '@asap-hub/validation';

import { Link, Tooltip } from '../atoms';
import { useTooltipTrigger } from '../hooks';
import { rem, mobileScreen } from '../pixels';

const containerStyles = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: rem(15),
    width: '100%',
  },
});

const tooltipContainerStyles = css({
  position: 'relative',
  height: 0,
});

const isValidMeetingLink = (meetingLink?: string): meetingLink is string =>
  !!meetingLink && new RegExp(urlExpression).test(meetingLink);

type JoinMeetingButtonProps = {
  readonly meetingLink?: string;
};

const JoinMeetingButton: React.FC<JoinMeetingButtonProps> = ({
  meetingLink,
}) => {
  const { shown: tooltipShown, triggerProps } =
    useTooltipTrigger<HTMLDivElement>({ openOnHover: true });

  if (isValidMeetingLink(meetingLink)) {
    return (
      <div css={containerStyles}>
        <Link href={meetingLink} noMargin primary buttonStyle small>
          Join Meeting Now
        </Link>
      </div>
    );
  }

  return (
    <div role="presentation" css={containerStyles} {...triggerProps}>
      <div css={tooltipContainerStyles}>
        <Tooltip shown={tooltipShown} width={160}>
          We’re sorry but we couldn’t find the link to this event.
          <br />
          Please contact ASAP for more information.
        </Tooltip>
      </div>
      <Link href={undefined} enabled={false} noMargin buttonStyle small>
        Join Meeting Now
      </Link>
    </div>
  );
};

export default JoinMeetingButton;

import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { urlExpression } from '@asap-hub/validation';

import { Link, Tooltip } from '../atoms';
import { rem, mobileScreen } from '../pixels';
import { canHover } from '../utils/common';

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
  const [tooltipShown, setTooltipShown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipShown) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setTooltipShown(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTooltipShown(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tooltipShown]);

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
    <div
      ref={containerRef}
      role="presentation"
      css={containerStyles}
      // Touch devices have no hover, so a tap toggles the tooltip; with a
      // mouse, hover already opened it and a click should not close it.
      onClick={() => setTooltipShown((shown) => canHover() || !shown)}
      onMouseEnter={() => canHover() && setTooltipShown(true)}
      onMouseLeave={() => setTooltipShown(false)}
    >
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

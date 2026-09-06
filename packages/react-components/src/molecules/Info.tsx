import { ReactNode, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';

import { Tooltip } from '../atoms';
import { infoIcon } from '../icons';
import { canHover } from '../utils/common';

const buttonStyles = css({
  padding: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'unset',

  cursor: 'pointer',
});

interface InfoProps {
  children: ReactNode;
  width?: string | number;
  background?: string;
  // Also opens on hover, the way the navigation rail tooltip does. Click stays
  // the primary trigger, so touch devices keep working.
  openOnHover?: boolean;
}
const Info: React.FC<InfoProps> = ({
  children,
  width,
  background,
  openOnHover = false,
}) => {
  const [tooltipShown, setTooltipShown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!tooltipShown) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!buttonRef.current?.contains(event.target as Node)) {
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

  return (
    <button
      ref={buttonRef}
      css={buttonStyles}
      // With hover on, the pointer already opened the tooltip by the time the
      // click lands, so toggling would close it mid-gesture; hovering out,
      // Escape and an outside click are what dismiss it.
      onClick={() => setTooltipShown((shown) => openOnHover || !shown)}
      onMouseEnter={
        openOnHover ? () => canHover() && setTooltipShown(true) : undefined
      }
      onMouseLeave={openOnHover ? () => setTooltipShown(false) : undefined}
      onFocus={openOnHover ? () => setTooltipShown(true) : undefined}
      onBlur={openOnHover ? () => setTooltipShown(false) : undefined}
    >
      <Tooltip shown={tooltipShown} width={width} background={background}>
        {children}
      </Tooltip>
      <span>{infoIcon}</span>
    </button>
  );
};

export default Info;

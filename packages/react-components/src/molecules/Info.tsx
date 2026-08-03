import { ReactNode, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';

import { Tooltip } from '../atoms';
import { infoIcon } from '../icons';

const buttonStyles = css({
  padding: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'unset',

  cursor: 'pointer',
});

interface InfoProps {
  children: ReactNode;
  icon?: ReactNode;
}
const Info: React.FC<InfoProps> = ({ children, icon = infoIcon }) => {
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
      onClick={() => setTooltipShown((shown) => !shown)}
    >
      <Tooltip shown={tooltipShown}>{children}</Tooltip>
      <span>{icon}</span>
    </button>
  );
};

export default Info;

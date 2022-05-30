import { ReactNode, useState } from 'react';
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
}
const Info: React.FC<InfoProps> = ({ children }) => {
  const [tooltipShown, setTooltipShown] = useState(false);

  return (
    <button css={buttonStyles} onClick={() => setTooltipShown(!tooltipShown)}>
      <Tooltip shown={tooltipShown}>{children}</Tooltip>
      <span>{infoIcon}</span>
    </button>
  );
};

export default Info;

import { ReactNode, useState } from 'react';
import { css } from '@emotion/react';

import { Tooltip } from '../atoms';
import { infoIcon } from '../icons';
import { charcoal, lead } from '../colors';

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
      <span css={{ svg: { stroke: tooltipShown ? charcoal.rgb : lead.rgb } }}>
        {infoIcon}
      </span>
    </button>
  );
};

export default Info;

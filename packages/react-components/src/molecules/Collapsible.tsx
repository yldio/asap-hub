import { css } from '@emotion/react';
import { useState } from 'react';

import { Button } from '../atoms';
import { chevronCircleDownIcon, chevronCircleUpIcon } from '../icons';
import { perRem } from '../pixels';
import { colorWithTransparency, lead } from '../colors';

const previewStyles = css({
  maxHeight: '120px',
  overflow: 'hidden',
  background: `linear-gradient(180deg, ${lead.rgb} 26.56%, ${
    colorWithTransparency(lead, 0).rgba
  } 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
});

interface CollapsibleProps {
  readonly initiallyExpanded?: boolean;
  readonly children: React.ReactNode;
}
const Collapsible: React.FC<CollapsibleProps> = ({
  initiallyExpanded,
  children,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  return (
    <div>
      <div css={[expanded ? { display: 'flex' } : previewStyles]}>
        {children}
      </div>
      <div
        css={{
          padding: `${12 / perRem}em 0`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button linkStyle onClick={() => setExpanded(!expanded)}>
          <span
            css={{
              display: 'inline-grid',
              verticalAlign: 'middle',
              paddingRight: `${12 / perRem}em`,
            }}
          >
            {expanded ? chevronCircleUpIcon : chevronCircleDownIcon}
          </span>
          {expanded ? 'Hide' : 'Show'} more
        </Button>
      </div>
    </div>
  );
};

export default Collapsible;

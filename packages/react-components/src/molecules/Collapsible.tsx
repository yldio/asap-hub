import React, { useState } from 'react';

import { Button } from '../atoms';
import { chevronCircleDownIcon, chevronCircleUpIcon } from '../icons';
import { perRem } from '../pixels';

export const ConditionalCollapsible: React.FC<
  CollapsibleProps & {
    readonly condition?: boolean;
  }
> = ({ condition = false, children, ...props }) =>
  condition ? (
    <Collapsible {...props}>{children}</Collapsible>
  ) : (
    <>{children}</>
  );

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
      <div css={{ display: expanded ? 'block' : 'none' }}>{children}</div>
      <div css={{ padding: `${12 / perRem}em 0` }}>
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
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </div>
    </div>
  );
};

export default Collapsible;

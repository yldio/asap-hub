import React from 'react';

import { perRem, formTargetWidth } from '../pixels';

interface LabelProps {
  readonly children?: React.ReactNode;
}
const Label: React.FC<LabelProps> = ({ children }) => (
  <label
    css={{
      display: 'block',
      width: `${formTargetWidth / perRem}em`,
      maxWidth: `min(${formTargetWidth / perRem}em, 100%)`,
      paddingBottom: `${18 / perRem}em`,
    }}
  >
    {children}
  </label>
);

export default Label;

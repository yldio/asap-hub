import React from 'react';

import { perRem } from '../pixels';

interface LabelProps {
  children?: React.ReactNode | React.ReactNodeArray;
}
const Label: React.FC<LabelProps> = ({ children }) => (
  <label
    css={{
      display: 'block',
      width: `${354 / perRem}em`,
      maxWidth: '100%',
      paddingBottom: `${18 / perRem}em`,
    }}
  >
    {children}
  </label>
);

export default Label;

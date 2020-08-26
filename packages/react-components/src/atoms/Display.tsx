import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface DisplayProps {
  readonly children: TextChildren;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Display: React.FC<DisplayProps> = ({
  children,
  styleAsHeading = 1,
  ...props
}) => (
  <h1 css={[layoutStyles, headlineStyles[styleAsHeading]]} {...props}>
    {children}
  </h1>
);

export default Display;

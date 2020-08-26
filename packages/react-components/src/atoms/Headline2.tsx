import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface Headline2Props {
  readonly children: TextChildren;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline2: React.FC<Headline2Props> = ({
  children,
  styleAsHeading = 2,
  ...props
}) => (
  <h2 css={[layoutStyles, headlineStyles[styleAsHeading]]} {...props}>
    {children}
  </h2>
);

export default Headline2;

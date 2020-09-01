import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface Headline3Props {
  readonly children: TextChildren;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline3: React.FC<Headline3Props> = ({
  children,
  styleAsHeading = 3,
  ...props
}) => (
  <h3 css={[layoutStyles, headlineStyles[styleAsHeading]]} {...props}>
    {children}
  </h3>
);

export default Headline3;

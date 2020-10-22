import React from 'react';

import { AllowedChildren, layoutStyles, headlineStyles } from '../text';

interface Headline4Props {
  readonly children: AllowedChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline4: React.FC<Headline4Props> = ({
  children,
  styleAsHeading = 4,
  id,
}) => (
  <h4 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h4>
);

export default Headline4;

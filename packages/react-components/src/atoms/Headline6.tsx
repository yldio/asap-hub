import React from 'react';

import { AllowedChildren, layoutStyles, headlineStyles } from '../text';

interface Headline6Props {
  readonly children: AllowedChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline6: React.FC<Headline6Props> = ({
  children,
  styleAsHeading = 6,
  id,
}) => (
  <h6 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h6>
);

export default Headline6;

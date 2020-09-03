import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface Headline2Props {
  readonly children: TextChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline2: React.FC<Headline2Props> = ({
  children,
  styleAsHeading = 2,
  id,
}) => (
  <h2 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h2>
);

export default Headline2;

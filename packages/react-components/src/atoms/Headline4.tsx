import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface Headline4Props {
  readonly children: TextChildren;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline4: React.FC<Headline4Props> = ({
  children,
  styleAsHeading = 4,
}) => <h4 css={[layoutStyles, headlineStyles[styleAsHeading]]}>{children}</h4>;

export default Headline4;

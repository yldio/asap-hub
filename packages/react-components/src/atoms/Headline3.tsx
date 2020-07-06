import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface Headline3Props {
  readonly children: TextChildren;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline3: React.FC<Headline3Props> = ({
  children,
  styleAsHeading = 3,
}) => <h3 css={[layoutStyles, headlineStyles[styleAsHeading]]}>{children}</h3>;

export default Headline3;

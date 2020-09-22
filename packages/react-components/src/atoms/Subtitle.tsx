import React from 'react';

import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface SubtitleProps {
  readonly children: TextChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Subtitle: React.FC<SubtitleProps> = ({
  children,
  styleAsHeading = 5,
  id,
}) => (
  <h5 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h5>
);

export default Subtitle;

import { css } from '@emotion/react';
import { AllowedChildren, headlineStyles, layoutStyles } from '../text';

interface Headline3Props {
  readonly children: AllowedChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
  readonly noMargin?: boolean;
}

const noMarginStyles = css({
  margin: 0,
});

const Headline3: React.FC<Headline3Props> = ({
  children,
  styleAsHeading = 3,
  id,
  noMargin = false,
}) => (
  <h3
    css={[
      layoutStyles,
      headlineStyles[styleAsHeading],
      noMargin && noMarginStyles,
    ]}
    id={id}
  >
    {children}
  </h3>
);

export default Headline3;

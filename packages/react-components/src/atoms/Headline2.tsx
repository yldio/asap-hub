import { AllowedChildren, layoutStyles, headlineStyles } from '../text';

interface Headline2Props {
  readonly children: AllowedChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
  readonly noMargin?: boolean;
}
const Headline2: React.FC<Headline2Props> = ({
  children,
  styleAsHeading = 2,
  id,
  noMargin = false,
}) => (
  <h2
    css={[
      layoutStyles,
      headlineStyles[styleAsHeading],
      noMargin && { margin: 0 },
    ]}
    id={id}
  >
    {children}
  </h2>
);

export default Headline2;

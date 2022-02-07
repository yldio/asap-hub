import { AllowedChildren, layoutStyles, headlineStyles } from '../text';

interface Headline3Props {
  readonly children: AllowedChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline3: React.FC<Headline3Props> = ({
  children,
  styleAsHeading = 3,
  id,
}) => (
  <h3 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h3>
);

export default Headline3;

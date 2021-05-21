import { AllowedChildren, layoutStyles, headlineStyles } from '../text';

interface Headline5Props {
  readonly children: AllowedChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Headline5: React.FC<Headline5Props> = ({
  children,
  styleAsHeading = 5,
  id,
}) => (
  <h5 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h5>
);

export default Headline5;

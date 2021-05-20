import { TextChildren, layoutStyles, headlineStyles } from '../text';

interface DisplayProps {
  readonly children: TextChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
}
const Display: React.FC<DisplayProps> = ({
  children,
  styleAsHeading = 1,
  id,
}) => (
  <h1 css={[layoutStyles, headlineStyles[styleAsHeading]]} id={id}>
    {children}
  </h1>
);

export default Display;

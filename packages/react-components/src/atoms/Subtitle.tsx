import * as colors from '../colors';
import {
  AccentColorName,
  headlineStyles,
  layoutStyles,
  TextChildren,
} from '../text';

interface SubtitleProps {
  readonly children: TextChildren;
  readonly id?: string;
  readonly styleAsHeading?: keyof typeof headlineStyles;
  readonly bold?: boolean;
  readonly accent?: AccentColorName;
  readonly margin?: boolean;
}
const Subtitle: React.FC<SubtitleProps> = ({
  children,
  styleAsHeading = 5,
  bold,
  id,
  accent,
  margin = true,
}) => (
  <h5
    css={[
      margin ? layoutStyles : { margin: 0 },
      headlineStyles[styleAsHeading],
      bold ? { fontWeight: 'bold' } : null,
      accent ? { color: colors[accent].rgb } : null,
    ]}
    id={id}
  >
    {children}
  </h5>
);

export default Subtitle;

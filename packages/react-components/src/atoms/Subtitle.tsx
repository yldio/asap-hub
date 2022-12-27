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
  readonly hasMargin?: boolean;
}
const Subtitle: React.FC<SubtitleProps> = ({
  children,
  styleAsHeading = 5,
  bold,
  id,
  accent,
  hasMargin = true,
}) => (
  <h5
    css={[
      layoutStyles,
      headlineStyles[styleAsHeading],
      bold ? { fontWeight: 'bold' } : null,
      accent ? { color: colors[accent].rgb } : null,
      !hasMargin ? { margin: 0 } : null,
    ]}
    id={id}
  >
    {children}
  </h5>
);

export default Subtitle;

import { TextChildren } from '../text';
import { Paragraph } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';

interface ComingSoonProps {
  children: TextChildren;
}
const ComingSoon: React.FC<ComingSoonProps> = ({ children }) => (
  <section css={{ textAlign: 'center', padding: `${24 / perRem}em 0` }}>
    <Paragraph>
      <strong>More to come!</strong>
      <br />
      <span css={{ color: lead.rgb }}>{children}</span>
    </Paragraph>
  </section>
);

export default ComingSoon;

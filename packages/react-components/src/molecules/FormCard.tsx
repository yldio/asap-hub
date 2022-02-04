import { Card, Headline2 } from '../atoms';
import { paddingStyles } from '../card';
import { steel } from '../colors';

interface FormCardProps {
  title: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, title }) => (
  <Card padding={false}>
    <div role="presentation" css={[paddingStyles]}>
      <Headline2>{title}</Headline2>
    </div>
    <hr color={steel.hex} />
    <div css={[paddingStyles]}>{children}</div>
  </Card>
);

export default FormCard;

import { Card, Headline3 } from '../atoms';
import { paddingStyles } from '../card';

interface FormCardProps {
  title: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, title }) => (
  <Card padding={false}>
    <div role="presentation" css={[paddingStyles]}>
      <Headline3>{title}</Headline3>
    </div>

    <div css={[paddingStyles]}>{children}</div>
  </Card>
);

export default FormCard;

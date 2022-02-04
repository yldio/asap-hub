import { css } from '@emotion/react';
import { Card, Headline3 } from '../atoms';
import { paddingStyles } from '../card';
import { steel } from '../colors';

interface FormCardProps {
  title: string;
}

const dividerStyles = css({
  margin: 0,
});

const FormCard: React.FC<FormCardProps> = ({ children, title }) => (
  <Card padding={false}>
    <div role="presentation" css={[paddingStyles]}>
      <Headline3 noMargin={true}>{title}</Headline3>
    </div>
    <hr color={steel.hex} css={[dividerStyles]} />
    <div css={[paddingStyles]}>{children}</div>
  </Card>
);

export default FormCard;

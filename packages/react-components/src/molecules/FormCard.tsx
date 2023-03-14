import { css } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { perRem } from '../pixels';

interface FormCardProps {
  title: string;
  description?: string;
}

const descriptionStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
  'p:first-of-type': {
    marginTop: 0,
    marginBottom: `${10 / perRem}em`,
  },
});

const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  description,
}) => (
  <Card padding={false}>
    <div role="presentation" css={[paddingStyles]}>
      <Headline3>{title}</Headline3>
    </div>
    {!!description && (
      <div css={[paddingStyles, descriptionStyles]}>
        <Paragraph>{description}</Paragraph>
      </div>
    )}
    <div css={[paddingStyles]}>{children}</div>
  </Card>
);

export default FormCard;

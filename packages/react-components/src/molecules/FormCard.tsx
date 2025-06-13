import { css, SerializedStyles } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { perRem } from '../pixels';

interface FormCardProps {
  title: string;
  description?: string | React.ReactNode;
  overrideStyles?: SerializedStyles;
}

const cardStyles = css({
  paddingTop: `${14 / perRem}em`,
});

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
  overrideStyles,
}) => (
  <Card padding={false} overrideStyles={cardStyles} title={title}>
    <div role="presentation" css={[paddingStyles, overrideStyles]}>
      <Headline3 noMargin>{title}</Headline3>
    </div>
    {!!description && (
      <div css={[paddingStyles, descriptionStyles]}>
        <Paragraph accent="lead">{description}</Paragraph>
      </div>
    )}
    <div css={[paddingStyles]}>{children}</div>
  </Card>
);

export default FormCard;

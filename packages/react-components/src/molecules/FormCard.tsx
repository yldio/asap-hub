import { css, SerializedStyles } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { rem } from '../pixels';

export type FormCardProps = {
  title: string;
  description?: string | React.ReactNode;
  overrideStyles?: SerializedStyles;
};

const cardStyles = css({
  paddingTop: rem(14),
});

const descriptionStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
  'p:first-of-type': {
    marginTop: 0,
    marginBottom: rem(10),
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

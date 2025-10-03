import { css, SerializedStyles } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { rem } from '../pixels';

export type FormCardProps = {
  title: string;
  description?: string | React.ReactNode;
  overrideStyles?: SerializedStyles;
};

const cardStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const descriptionStyles = css({
  paddingTop: rem(24),
  paddingBottom: 0,
});

const childrenWrapStyles = css({
  marginTop: rem(32),
  display: 'flex',
  flexFlow: 'column',
  gap: rem(48),
});

const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  description,
  overrideStyles,
}) => (
  <Card padding={false} overrideStyles={cardStyles} title={title}>
    <div role="presentation" css={[overrideStyles]}>
      <Headline3 noMargin>{title}</Headline3>
    </div>
    {!!description && (
      <div css={[descriptionStyles]}>
        <Paragraph noMargin accent="lead">
          {description}
        </Paragraph>
      </div>
    )}
    <div css={[childrenWrapStyles]}>{children}</div>
  </Card>
);

export default FormCard;

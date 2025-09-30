import { css, SerializedStyles } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';

export type FormCardProps = {
  title: string;
  description?: string | React.ReactNode;
  overrideStyles?: SerializedStyles;
};

const cardStyles = css({
  padding: '32px 24px',
});

const descriptionStyles = css({
  paddingTop: 24,
  paddingBottom: 0,
});

const childrenWrapStyles = css({
  marginTop: 32,
  display: 'flex',
  flexFlow: 'column',
  gap: 48,
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

import { css, SerializedStyles } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { perRem } from '../pixels';

export type FormCardProps = {
  title: string;
  description?: string | React.ReactNode;
  overrideStyles?: SerializedStyles;
};

const cardStyles = css({
  padding: '32px 24px',
});

const descriptionStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
  'p:first-of-type': {
    marginTop: 0,
    marginBottom: `${10 / perRem}em`,
  },
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
      <div css={[paddingStyles, descriptionStyles]}>
        <Paragraph accent="lead">{description}</Paragraph>
      </div>
    )}
    <div css={[childrenWrapStyles]}>{children}</div>
  </Card>
);

export default FormCard;

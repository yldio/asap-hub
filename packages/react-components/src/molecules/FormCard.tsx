import { css, SerializedStyles } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { rem } from '../pixels';
import LabeledFieldGroup from './LabeledFieldGroup';

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
    <LabeledFieldGroup>{children}</LabeledFieldGroup>
  </Card>
);

export default FormCard;

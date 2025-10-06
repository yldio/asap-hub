import { css } from '@emotion/react';
import { Card, Headline3, Paragraph } from '../atoms';
import { rem } from '../pixels';
import LabeledFieldGroup from './LabeledFieldGroup';

export type FormCardProps = {
  title: string;
  description?: string | React.ReactNode;
  borderless?: boolean;
  headerDecorator?: React.ReactNode;
};

const cardStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const titleStyles = css({
  display: 'flex',
  flexFlow: 'row',
  gap: rem(10),
  alignItems: 'center',
  justifyContent: 'space-between',
});

const cardStylesBorderless = css({
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
});

const descriptionStyles = css({
  paddingTop: rem(24),
  paddingBottom: 0,
});

const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  description,
  borderless = false,
  headerDecorator,
}) => (
  <Card
    padding={false}
    stroke={false}
    shadow={false}
    title={title}
    overrideStyles={css([cardStyles, borderless && cardStylesBorderless])}
  >
    <div role="presentation" css={[titleStyles]}>
      <div style={{ flex: 1 }}>
        <Headline3 noMargin>{title}</Headline3>
      </div>
      <div>{headerDecorator}</div>
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

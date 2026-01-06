import { css } from '@emotion/react';
import { Card } from '../atoms';
import { rem } from '../pixels';
import FormSection from './FormSection';

export type FormCardProps = {
  title?: string;
  description?: string | React.ReactNode;
  headerDecorator?: React.ReactNode;
  children?: React.ReactNode;
};

const cardStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  description,
  headerDecorator,
}) => (
  <Card
    padding={false}
    stroke={false}
    shadow={true}
    overrideStyles={css([cardStyles])}
  >
    <FormSection
      title={title}
      headerDecorator={headerDecorator}
      description={description}
    >
      {children}
    </FormSection>
  </Card>
);

export default FormCard;

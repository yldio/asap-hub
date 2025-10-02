import { css } from '@emotion/react';
import { ComponentProps, ReactNode } from 'react';
import { Typeahead, Paragraph, Label } from '../atoms';
import { perRem, rem } from '../pixels';

const subtitleStyles = {
  paddingLeft: `${6 / perRem}em`,
};

type LabeledTypeaheadProps = {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
} & Exclude<ComponentProps<typeof Typeahead>, 'id'>;

const LabeledTypeahead: React.FC<LabeledTypeaheadProps> = ({
  title,
  subtitle,
  ...typeaheadProps
}) => (
  <div>
    <Label forContent={(id) => <Typeahead {...typeaheadProps} id={id} />}>
      <Paragraph noMargin styles={css({ paddingBottom: rem(16) })}>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledTypeahead;

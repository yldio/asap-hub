import { ComponentProps, ReactNode } from 'react';
import { Typeahead, Paragraph, Label } from '../atoms';
import { perRem } from '../pixels';

type LabeledTypeaheadProps = {
  readonly title: ReactNode;
  readonly titleLabel?: React.ReactNode;
} & Exclude<ComponentProps<typeof Typeahead>, 'id'>;
const LabeledTypeahead: React.FC<LabeledTypeaheadProps> = ({
  title,
  titleLabel,
  ...typeaheadProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <Typeahead {...typeaheadProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <span css={{ paddingLeft: '5px' }}>{titleLabel}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledTypeahead;

import React, { ComponentProps } from 'react';

import { perRem } from '../pixels';
import { Label, TextArea, Paragraph } from '../atoms';

type LabeledTextAreaProps = {
  readonly title: React.ReactNode;
} & Exclude<ComponentProps<typeof TextArea>, 'id'>;
const LabeledTextArea: React.FC<LabeledTextAreaProps> = ({
  title,
  ...textAreaProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <TextArea {...textAreaProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledTextArea;

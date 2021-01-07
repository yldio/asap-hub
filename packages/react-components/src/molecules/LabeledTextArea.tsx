import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { Label, TextArea, Paragraph } from '../atoms';
import { lead } from '../colors';

const tipStyles = css({
  ':empty': {
    display: 'none',
  },
  paddingTop: `${6 / perRem}em`,

  color: lead.rgb,
});

type LabeledTextAreaProps = {
  readonly title: React.ReactNode;
  readonly tip?: React.ReactNode;
} & Exclude<ComponentProps<typeof TextArea>, 'id'>;
const LabeledTextArea: React.FC<LabeledTextAreaProps> = ({
  title,
  tip,
  ...textAreaProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <TextArea {...textAreaProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <br />
        <span css={tipStyles}>{tip}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledTextArea;

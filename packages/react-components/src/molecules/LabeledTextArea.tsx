import { ComponentProps } from 'react';
import { css } from '@emotion/react';

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

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

type LabeledTextAreaProps = {
  readonly title?: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly tip?: React.ReactNode;
} & Exclude<ComponentProps<typeof TextArea>, 'id'>;

const LabeledTextArea: React.FC<LabeledTextAreaProps> = ({
  title,
  subtitle,
  tip,
  ...textAreaProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <TextArea {...textAreaProps} id={id} />}>
      {title || subtitle || tip ? (
        <Paragraph>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
          <br />
          <span css={tipStyles}>{tip}</span>
        </Paragraph>
      ) : undefined}
    </Label>
  </div>
);

export default LabeledTextArea;

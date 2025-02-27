import { ComponentProps, forwardRef } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { perRem } from '../pixels';
import { Label, Paragraph, TextEditor } from '../atoms';
import { lead } from '../colors';

const tipStyles = css({
  marginTop: 0,
  ':empty': {
    display: 'none',
  },
  paddingTop: 0,

  color: lead.rgb,
});

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

type LabeledTextEditorProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly tip?: React.ReactNode;
  readonly info?: React.ReactNode;
  readonly editorStyles?: SerializedStyles;
  readonly hasError?: boolean;
  readonly autofocus?: boolean;
} & Exclude<ComponentProps<typeof TextEditor>, 'id'>;

const LabeledTextEditor: React.FC<LabeledTextEditorProps> = forwardRef<
  HTMLDivElement,
  LabeledTextEditorProps
>(({ title, subtitle, tip, info, ...textEditorProps }, ref) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label
      forContent={(id) => <TextEditor {...textEditorProps} id={id} ref={ref} />}
    >
      <Paragraph>
        <span css={{ display: 'flex', marginBottom: 0 }}>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
        </span>
        <span css={tipStyles}>{tip}</span>
      </Paragraph>
    </Label>
  </div>
));

export default LabeledTextEditor;

import { ComponentProps, forwardRef } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { perRem } from '../pixels';
import { Label, Paragraph, TextEditor } from '../atoms';
import { lead } from '../colors';

const containerStyles = css({ paddingBottom: `${18 / perRem}em` });

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
  readonly noPadding?: boolean;
} & Exclude<ComponentProps<typeof TextEditor>, 'id'>;

const LabeledTextEditor: React.FC<LabeledTextEditorProps> = forwardRef<
  HTMLDivElement,
  LabeledTextEditorProps
>(
  (
    { title, subtitle, tip, info, noPadding = false, ...textEditorProps },
    ref,
  ) => (
    <div css={[containerStyles, noPadding && { paddingBottom: 0 }]}>
      <Label
        forContent={(id) => (
          <TextEditor {...textEditorProps} id={id} ref={ref} />
        )}
      >
        <Paragraph noMargin styles={css({ paddingBottom: 16 })}>
          <span css={{ display: 'flex' }}>
            <strong>{title}</strong>
            <span css={subtitleStyles}>{subtitle}</span>
          </span>
          <span css={tipStyles}>{tip}</span>
        </Paragraph>
      </Label>
    </div>
  ),
);

export default LabeledTextEditor;

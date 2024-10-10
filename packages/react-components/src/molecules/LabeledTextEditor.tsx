import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { Label, Paragraph, TextEditor } from '../atoms';
import { lead, paper } from '../colors';
import { TooltipInfo } from '.';

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
} & Exclude<ComponentProps<typeof TextEditor>, 'id'>;

const infoStyle = css({
  [`p:first-of-type`]: {
    marginBottom: `${8 / perRem}em`,
  },
  [`p:not(:first-of-type)`]: {
    marginBottom: `${2 / perRem}em`,
  },
  [`& p`]: {
    textAlign: 'left',
    color: paper.rgb,
    marginTop: 0,
  },
});

const infoWrapperStyle = css({
  paddingLeft: `${16 / perRem}em`,
  lineHeight: 0,
  [`span, button`]: {
    lineHeight: 0,
  },
});

const LabeledTextEditor: React.FC<LabeledTextEditorProps> = ({
  title,
  subtitle,
  tip,
  info,
  ...textEditorProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <TextEditor {...textEditorProps} id={id} />}>
      <Paragraph>
        <span css={{ display: 'flex', marginBottom: 0 }}>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
          {info ? (
            <TooltipInfo
              overrideWrapperStyles={infoWrapperStyle}
              overrideTooltipStyles={infoStyle}
            >
              {info}
            </TooltipInfo>
          ) : null}
        </span>
        <span css={tipStyles}>{tip}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledTextEditor;

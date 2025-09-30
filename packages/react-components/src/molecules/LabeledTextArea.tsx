import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { Label, Paragraph, TextArea } from '../atoms';
import { lead, paper } from '../colors';
import { TooltipInfo } from '.';

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

type LabeledTextAreaProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly tip?: React.ReactNode;
  readonly info?: React.ReactNode;
  readonly noPadding?: boolean;
} & Exclude<ComponentProps<typeof TextArea>, 'id'>;

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

const LabeledTextArea: React.FC<LabeledTextAreaProps> = ({
  title,
  subtitle,
  tip,
  info,
  noPadding = false,
  ...textAreaProps
}) => (
  <div css={[containerStyles, noPadding && { paddingBottom: 0 }]}>
    <Label forContent={(id) => <TextArea {...textAreaProps} id={id} />}>
      <Paragraph noMargin styles={css({ paddingBottom: 16 })}>
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

export default LabeledTextArea;

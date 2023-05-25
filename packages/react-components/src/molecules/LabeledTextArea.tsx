import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { Label, Paragraph, TextArea } from '../atoms';
import { lead, paper } from '../colors';
import Info from './Info';

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
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly tip?: React.ReactNode;
  readonly info?: React.ReactNode;
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
});

const LabeledTextArea: React.FC<LabeledTextAreaProps> = ({
  title,
  subtitle,
  tip,
  info,
  ...textAreaProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <TextArea {...textAreaProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
        {info && (
          <span css={infoWrapperStyle} onClick={(e) => e.preventDefault()}>
            <Info>
              <span css={infoStyle}>{info}</span>
            </Info>
          </span>
        )}
        <br />
        <span css={tipStyles}>{tip}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledTextArea;

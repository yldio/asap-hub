import { css } from '@emotion/react';
import { ReactElement } from 'react';
import { Dropdown, DropdownProps, Label, Paragraph } from '../atoms';
import { lead } from '../colors';
import { perRem, tabletScreen } from '../pixels';
import { TooltipInfo } from '.';

const containerStyles = css({ paddingBottom: `${18 / perRem}em` });

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
  display: 'inline-block',
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    display: 'unset',
  },
});

const infoWrapperStyle = css({
  paddingLeft: `${6 / perRem}em`,
  float: 'right',
});

export type LabeledDropdownProps<V extends string> = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly info?: Array<ReactElement>;
  readonly noPadding?: boolean;
} & Exclude<DropdownProps<V>, 'id'>;
export default function LabeledDropdown<V extends string>({
  title,
  subtitle,
  description,
  info,
  noPadding = false,
  ...dropdownProps
}: LabeledDropdownProps<V>): ReturnType<React.FC> {
  return (
    <div css={[containerStyles, noPadding && { paddingBottom: 0 }]}>
      <Label forContent={(id) => <Dropdown {...dropdownProps} id={id} />}>
        <Paragraph noMargin styles={css({ paddingBottom: 16 })}>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
          {info ? (
            <TooltipInfo overrideWrapperStyles={infoWrapperStyle}>
              {info}
            </TooltipInfo>
          ) : null}
          {description ? (
            <>
              <br />
              <span css={descriptionStyles}>{description}</span>
            </>
          ) : null}
        </Paragraph>
      </Label>
    </div>
  );
}

export type LabeledDropdownType = typeof LabeledDropdown;

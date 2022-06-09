import { css } from '@emotion/react';
import { ReactElement } from 'react';
import { Dropdown, DropdownProps, Label, Paragraph } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { Info } from '.';

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});

const infoStyle = css({
  display: 'grid',
  gap: `${6 / perRem}em`,
  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,
});

const infoWrapperStyle = css({
  paddingLeft: `${6 / perRem}em`,
});

type LabeledDropdownProps<V extends string> = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly info?: Array<ReactElement>;
} & Exclude<DropdownProps<V>, 'id'>;
export default function LabeledDropdown<V extends string>({
  title,
  subtitle,
  description,
  info,
  ...dropdownProps
}: LabeledDropdownProps<V>): ReturnType<React.FC> {
  return (
    <div css={{ paddingBottom: `${18 / perRem}em` }}>
      <Label forContent={(id) => <Dropdown {...dropdownProps} id={id} />}>
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
          <span css={descriptionStyles}>{description}</span>
        </Paragraph>
      </Label>
    </div>
  );
}

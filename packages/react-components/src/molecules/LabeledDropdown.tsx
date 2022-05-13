import { css } from '@emotion/react';
import { Dropdown, DropdownProps, Label, Paragraph } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});

type LabeledDropdownProps<V extends string> = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;
} & Exclude<DropdownProps<V>, 'id'>;
export default function LabeledDropdown<V extends string>({
  title,
  subtitle,
  description,
  ...dropdownProps
}: LabeledDropdownProps<V>): ReturnType<React.FC> {
  return (
    <div css={{ paddingBottom: `${18 / perRem}em` }}>
      <Label forContent={(id) => <Dropdown {...dropdownProps} id={id} />}>
        <Paragraph>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span> <br />
          <span css={descriptionStyles}>{description}</span>
        </Paragraph>
      </Label>
    </div>
  );
}

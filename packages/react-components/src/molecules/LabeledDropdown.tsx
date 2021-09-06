import { Dropdown, Paragraph, Label, DropdownProps } from '../atoms';
import { perRem } from '../pixels';

const subtitleStyles = {
  paddingLeft: `${6 / perRem}em`,
};

type LabeledDropdownProps<V extends string> = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
} & Exclude<DropdownProps<V>, 'id'>;
export default function LabeledDropdown<V extends string>({
  title,
  subtitle,
  ...dropdownProps
}: LabeledDropdownProps<V>): ReturnType<React.FC> {
  return (
    <div css={{ paddingBottom: `${18 / perRem}em` }}>
      <Label forContent={(id) => <Dropdown {...dropdownProps} id={id} />}>
        <Paragraph>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
        </Paragraph>
      </Label>
    </div>
  );
}

import {
  Dropdown,
  Paragraph,
  Label,
  DropdownProps,
  FieldTitle,
} from '../atoms';
import { perRem } from '../pixels';

type LabeledDropdownProps<V extends string> = {
  readonly title: React.ReactNode;
} & Exclude<DropdownProps<V>, 'id'>;
export default function LabeledDropdown<V extends string>({
  title,
  ...dropdownProps
}: LabeledDropdownProps<V>): ReturnType<React.FC> {
  return (
    <div css={{ paddingBottom: `${18 / perRem}em` }}>
      <Label forContent={(id) => <Dropdown {...dropdownProps} id={id} />}>
        <Paragraph>
          <FieldTitle {...dropdownProps}>
            <strong>{title}</strong>
          </FieldTitle>
        </Paragraph>
      </Label>
    </div>
  );
}

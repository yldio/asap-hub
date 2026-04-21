import { css } from '@emotion/react';
import { colors } from '..';
import { lead, paper, steel, tin } from '../colors';
import { borderWidth } from '../form';
import { rem } from '../pixels';

const containerStyles = css({
  padding: rem(6),
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
});

const disabledStyles = css({
  borderColor: tin.rgb,
  color: tin.rgb,
});

const pillStyles = (selected: boolean, error: boolean) =>
  css({
    padding: `${rem(5)} ${rem(15)} ${rem(5)}`,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderStyle: 'solid',
    borderWidth: `${borderWidth}px`,
    borderColor: error ? tin.rgb : selected ? colors.info150.rgba : steel.rgb,
    borderRadius: rem(24),
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: selected ? colors.info100.rgba : paper.rgb,
    color: selected ? colors.info500.rgba : lead.rgba,
  });

const hoverStyles = css({
  ':hover': {
    backgroundColor: colors.info100.rgba,
    borderColor: colors.info500.rgba,
    color: colors.info500.rgba,
  },
});

type PillOption<V extends string> = {
  value: V;
  label: string;
};

type PillSelectorProps<V extends string> = {
  options: PillOption<V>[];
  value: V[];
  onChange: (value: V[]) => void;
  enabled?: boolean;
  error?: boolean;
};

const PillSelector = <V extends string>({
  options,
  value,
  onChange,
  enabled = true,
  error = false,
}: PillSelectorProps<V>) => {
  const toggle = (val: V) => {
    if (!enabled) return;
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div css={containerStyles}>
      {options.map((option) => {
        const selected = value.includes(option.value);

        return (
          <button
            key={option.value}
            css={[
              pillStyles(selected, error),
              ...(enabled ? [hoverStyles] : [disabledStyles]),
            ]}
            type="button"
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default PillSelector;

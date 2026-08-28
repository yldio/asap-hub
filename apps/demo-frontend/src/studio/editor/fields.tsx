/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ChangeEvent, FC } from 'react';
import { editorTheme } from './editorTheme';

// the label and its control, for the fields below and for the one-off controls
// an inspector needs that are not worth a component of their own
export const fieldStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 13,
  color: editorTheme.muted,
});

const controlStyles = css({
  height: 30,
  borderRadius: 6,
  border: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.raised,
  color: editorTheme.text,
  padding: '0 8px',
  font: 'inherit',
  fontSize: 13,
  width: '100%',
  boxSizing: 'border-box',
});

export const panelStyles = css({
  gridColumn: 3,
  gridRow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  borderLeft: `1px solid ${editorTheme.line}`,
  backgroundColor: editorTheme.panel,
  width: 260,
  flexShrink: 0,
  overflowY: 'auto',
  '@media (max-width: 1100px)': { width: 'auto', borderLeft: 0, gridColumn: 1 },
});

export const panelHeadingStyles = css({
  margin: 0,
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: editorTheme.muted,
});

export const mutedStyles = css({ color: editorTheme.muted, fontSize: 13 });

export const readingStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: 13,
  fontVariantNumeric: 'tabular-nums',
});

export const TextField: FC<{
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly onChange: (value: string) => void;
}> = ({ label, value, disabled, placeholder, onChange }) => (
  <label css={fieldStyles}>
    {label}
    <input
      css={controlStyles}
      type="text"
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value)
      }
    />
  </label>
);

export const NumberField: FC<{
  readonly label: string;
  readonly value: number;
  readonly step?: number;
  readonly min?: number;
  readonly disabled?: boolean;
  readonly onChange: (value: number) => void;
}> = ({ label, value, step = 100, min = 0, disabled, onChange }) => (
  <label css={fieldStyles}>
    {label}
    <input
      css={controlStyles}
      type="number"
      value={value}
      step={step}
      min={min}
      disabled={disabled}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

export const SelectField: FC<{
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly options: { value: string; label: string }[];
  readonly onChange: (value: string) => void;
}> = ({ label, value, disabled, options, onChange }) => (
  <label css={fieldStyles}>
    {label}
    <select
      css={controlStyles}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const sliderStyles = css({ width: '100%', accentColor: editorTheme.playhead });

const fadeLimitMs = 2000;
const fadeStepMs = 50;

const describeFade = (ms: number): string =>
  ms === 0 ? 'instant' : `${(ms / 1000).toFixed(2)}s`;

export const FadeField: FC<{
  readonly label: string;
  readonly value: number;
  readonly disabled?: boolean;
  readonly onChange: (ms: number) => void;
}> = ({ label, value, disabled, onChange }) => (
  <label css={fieldStyles}>
    {`${label} ${describeFade(value)}`}
    <input
      css={sliderStyles}
      type="range"
      min={0}
      max={fadeLimitMs}
      step={fadeStepMs}
      disabled={disabled}
      value={Math.min(fadeLimitMs, value)}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(Number(event.target.value))
      }
    />
  </label>
);

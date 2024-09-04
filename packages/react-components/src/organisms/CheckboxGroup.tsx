import { css } from '@emotion/react';
import { Fragment, useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { Caption } from '../atoms';
import { Info, LabeledCheckbox } from '../molecules';
import { perRem } from '../pixels';
import { noop } from '../utils';

export interface Option<V extends string> {
  value: V;
  label: string;
  enabled?: boolean;
}

export interface Title {
  title: string;
  label?: undefined;
  info?: string;
}

const infoWrapperStyle = css({
  display: 'inline-flex',
  verticalAlign: 'bottom',
  paddingLeft: `${6 / perRem}em`,
});

const infoStyle = css({
  display: 'grid',
  gap: `${6 / perRem}em`,
  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,
});

interface CheckboxGroupProps<V extends string> {
  readonly options: ReadonlyArray<Option<V> | Title>;
  readonly values?: ReadonlySet<V>;
  readonly onChange?: (newValue: V) => void;
}
export default function CheckboxGroup<V extends string>({
  options,

  values = new Set(),
  onChange = noop,
}: CheckboxGroupProps<V>): ReturnType<React.FC> {
  const groupName = useRef(uuidV4());
  return (
    <>
      {options.map((option, index) => (
        <Fragment key={`${groupName}-${index}`}>
          {option.label === undefined ? (
            <Caption asParagraph>
              <strong>{option.title}</strong>
              {option.info && (
                <span
                  css={infoWrapperStyle}
                  onClick={(e) => e.preventDefault()}
                >
                  <Info>
                    <span css={infoStyle}>{option.info}</span>
                  </Info>
                </span>
              )}
            </Caption>
          ) : (
            <LabeledCheckbox
              wrapLabel={false}
              groupName={groupName.current}
              title={option.label}
              enabled={option.enabled}
              checked={values.has(option.value)}
              onSelect={() => onChange(option.value)}
            />
          )}
        </Fragment>
      ))}
    </>
  );
}

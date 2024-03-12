// knobs addon is deprecated - this is a placeholder until we use the new syntax for args.

export const text = (name: string, value: string, groupId?: string): string =>
  value;

type NumberTypeKnobValue = number;
export interface NumberTypeKnobOptions {
  range?: boolean;
  min?: number;
  max?: number;
  step?: number;
}
export declare type NumberTypeKnob = NumberTypeKnobOptions & {
  value?: NumberTypeKnobValue;
};
export const number = (
  name: string,
  value: number,
  options?: NumberTypeKnobOptions,
  groupId?: string,
) => value;
export const boolean = (
  name: string,
  value: boolean,
  groupId?: string,
): boolean => value;
export const array = (label: string, value: string[], separator?: string) =>
  value;
export const date = (label: string, value?: Date) => value || new Date();

type SelectTypeKnobValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | PropertyKey[]
  | Record<string, unknown>;
type SelectTypeOptionsProp<
  T extends SelectTypeKnobValue = SelectTypeKnobValue,
> =
  | Record<PropertyKey, T>
  | Record<Extract<T, PropertyKey>, T[keyof T]>
  | T[]
  | readonly T[];

export const select = <T extends SelectTypeKnobValue>(
  name: string,
  options: SelectTypeOptionsProp<T>,
  value: T,
  groupId?: string,
): T => value;

type OptionsTypeKnobSingleValue =
  | string
  | number
  | null
  | undefined
  | string[]
  | number[]
  | (string | number)[];
type OptionsTypeKnobValue<
  T extends OptionsTypeKnobSingleValue = OptionsTypeKnobSingleValue,
> = T | NonNullable<T>[] | readonly NonNullable<T>[];
type OptionsKnobOptionsDisplay =
  | 'radio'
  | 'inline-radio'
  | 'check'
  | 'inline-check'
  | 'select'
  | 'multi-select';
interface OptionsKnobOptions {
  display: OptionsKnobOptionsDisplay;
}

interface OptionsTypeOptionsProp<T> {
  [key: string]: T;
}

export const optionsKnob = <T extends OptionsTypeKnobSingleValue>(
  name: string,
  valuesObj: OptionsTypeOptionsProp<T>,
  value: OptionsTypeKnobValue<T>,
  optionsObj: OptionsKnobOptions,
  groupId?: string,
) => value;

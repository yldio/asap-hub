const makePlaceholder = (name: string): string => `{{ ${name} }}`;
const makePlaceholders = <T extends string>(...names: T[]): Record<T, string> =>
  Object.fromEntries(
    names.map((name) => [name, makePlaceholder(name)]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;

export const welcome = makePlaceholders('firstName', 'link');

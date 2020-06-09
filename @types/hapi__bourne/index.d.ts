export interface BourneOptions {
  protoAction?: 'error' | 'remove' | 'ignore';
}
export const parse: (
  text: Parameters<typeof JSON.parse>[0],
  reviver?: Parameters<typeof JSON.parse>[1],
  options?: BourneOptions,
) => ReturnType<typeof JSON.parse>;
export const scan: (
  obj: ReturnType<typeof JSON.parse>,
  options?: BourneOptions,
) => void;

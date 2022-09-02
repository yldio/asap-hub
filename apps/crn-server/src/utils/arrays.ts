export const getFirstOrAll = <T>(
  arr: Array<T>,
):
  | T
  | {
      or: T[];
    }
  | undefined => (arr.length === 1 ? arr[0] : { or: arr });

export const cleanArray = <Item>(
  items: Array<Item | null> | undefined,
): Array<Item> =>
  (items || []).filter((item: Item | null): item is Item => item !== null);

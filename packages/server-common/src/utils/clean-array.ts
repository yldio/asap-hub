export const cleanArray = <Item>(
  items: Array<Item | null | undefined> | undefined,
): Array<Item> => (items ?? []).filter((item): item is Item => item != null);

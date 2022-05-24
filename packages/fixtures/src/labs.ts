import { Lab, ListLabsResponse } from '@asap-hub/model/src/lab';

export const createLabs = ({ labs = 1 }: { labs?: number }): Lab[] =>
  Array.from({ length: labs }, (_, index) => ({
    id: `l${index}`,
    name: `Example ${index + 1}`,
  }));

export const createListLabsResponse = (items: number): ListLabsResponse => ({
  total: items,
  items: createLabs({ labs: items }),
});

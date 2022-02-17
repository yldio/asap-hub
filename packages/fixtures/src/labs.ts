import { LabResponse } from '@asap-hub/model/src/lab';

export const createLabs = ({ labs = 1 }: { labs?: number }): LabResponse[] =>
  Array.from({ length: labs }, (_, index) => ({
    id: `l${index}`,
    name: `Example ${index + 1}`,
  }));

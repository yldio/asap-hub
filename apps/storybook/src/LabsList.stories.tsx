import { LabsList } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labs List',
  component: LabsList,
};

export const SingleLab = () => (
  <LabsList labs={[{ id: 'lab-1', name: 'Bhatt' }]} />
);

export const TwoLabs = () => (
  <LabsList
    labs={[
      { id: 'lab-1', name: 'Bhatt' },
      { id: 'lab-2', name: 'Bhatt-Bhatt' },
    ]}
  />
);

export const ThreeLabsWithOverflow = () => (
  <LabsList
    labs={[
      { id: 'lab-1', name: 'Bhatt' },
      { id: 'lab-2', name: 'Bhatt-Bhatt' },
      { id: 'lab-3', name: 'Bhatt-Smith' },
    ]}
  />
);

export const FourLabsWithOverflow = () => (
  <LabsList
    labs={[
      { id: 'lab-1', name: 'Bhatt' },
      { id: 'lab-2', name: 'Bhatt-Bhatt' },
      { id: 'lab-3', name: 'Bhatt-Smith' },
      { id: 'lab-4', name: 'Anderson' },
    ]}
  />
);

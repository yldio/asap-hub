import { MaterialAvailability } from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Material Availability',
  component: MaterialAvailability,
};

export const Normal = () => (
  <MaterialAvailability
    meetingMaterial={select(
      'Meeting Material',
      {
        Available: 'Something',
        'Coming Soon': undefined,
        Unavailable: null,
      },
      undefined,
    )}
    meetingMaterialType={select(
      'Type',
      {
        Notes: 'notes',
        'Video Recording': 'videoRecording',
        Presentation: 'presentation',
        'Meeting Material': 'meetingMaterials',
      },
      'notes',
    )}
  />
);

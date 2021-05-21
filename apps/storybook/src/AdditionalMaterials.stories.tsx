import { AdditionalMaterials } from '@asap-hub/react-components';
import { number, text } from '@storybook/addon-knobs';
import { createEventResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Events / Additional Materials',
};

export const Normal = () => {
  const { meetingMaterials } = createEventResponse({
    meetingMaterials: number('Meeting Material count', 3, { min: 0 }),
  });
  return (
    <AdditionalMaterials
      meetingMaterials={
        meetingMaterials
          ? meetingMaterials.map((material, i) =>
              i === 0
                ? {
                    title: text('title', 'Material 0'),
                    url: text('url', 'http://example.com'),
                  }
                : material,
            )
          : meetingMaterials
      }
    />
  );
};

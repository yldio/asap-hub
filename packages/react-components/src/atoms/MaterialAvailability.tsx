import { eventMaterialTypes } from '@asap-hub/model';
import { css } from '@emotion/react';
import { fern, tin } from '../colors';
import { crossSmallIcon, tickSmallIcon } from '../icons';
import { perRem } from '../pixels';

const baseStyles = css({
  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: 'min-content',
  columnGap: `${3 / perRem}em`,
});

const availableStyles = css({
  color: fern.rgb,
  svg: {
    fill: fern.rgb,
    stroke: fern.rgb,
  },
});

const unavailableStyles = css({
  color: tin.rgb,
  svg: {
    fill: tin.rgb,
    stroke: tin.rgb,
  },
});

const typeToReadable: Record<typeof eventMaterialTypes[number], string> = {
  meetingMaterials: 'Additional Materials',
  notes: 'Notes',
  presentation: 'Presentations',
  videoRecording: 'Videos',
};

type MaterialAvailabilityProps = {
  meetingMaterial: string | null | undefined;
  meetingMaterialType: typeof eventMaterialTypes[number];
};

const MaterialAvailability: React.FC<MaterialAvailabilityProps> = ({
  meetingMaterial,
  meetingMaterialType,
}) => {
  const readableType = typeToReadable[meetingMaterialType];
  return (
    <div
      css={[baseStyles, meetingMaterial ? availableStyles : unavailableStyles]}
    >
      {meetingMaterial ? tickSmallIcon : crossSmallIcon}{' '}
      {meetingMaterial && readableType}
      {meetingMaterial === undefined && `${readableType} coming soon`}
      {meetingMaterial === null && `No ${readableType.toLocaleLowerCase()}`}
    </div>
  );
};

export default MaterialAvailability;

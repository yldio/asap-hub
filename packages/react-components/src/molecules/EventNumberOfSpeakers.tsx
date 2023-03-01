import { EventResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { neutral900 } from '../colors';
import { speakerIcon } from '../icons';
import { rem } from '../pixels';

const listItemStyles = css({
  padding: `${rem(7.5)} 0`,
  color: neutral900.rgb,
  whiteSpace: 'break-spaces',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: rem(17),
  display: 'flex',
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: rem(24),
  height: rem(24),
  paddingRight: rem(9),
});

const EventNumberOfSpeakers: React.FC<{
  speakers: EventResponse['speakers'];
}> = ({ speakers }) => {
  const numberOfSpeakers = speakers.filter(
    (speaker) => 'user' in speaker || 'externalUser' in speaker,
  ).length;

  if (numberOfSpeakers === 0) {
    return null;
  }

  return (
    <div css={listItemStyles}>
      <span css={iconStyles}>{speakerIcon}</span> {numberOfSpeakers} Speaker
      {numberOfSpeakers === 1 ? '' : 's'}
    </div>
  );
};

export default EventNumberOfSpeakers;

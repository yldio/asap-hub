import { css } from '@emotion/react';
import { contentSidePaddingWithNavigation } from '../layout';
import { perRem } from '../pixels';

import OutputVersions, { OutputVersionsProps } from './OutputVersions';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  maxWidth: `${800 / perRem}em`,
});

const OutputVersionsFormCard: React.FC<OutputVersionsProps> = ({
  versions,
}) => {
  return (
    <div css={containerStyles}>
      <OutputVersions versions={versions} edit />
    </div>
  );
};

export default OutputVersionsFormCard;

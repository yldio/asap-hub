import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Display, TagLabel, RichText } from '../atoms';
import { pearl } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

const containerStyles = css({
  alignSelf: 'stretch',
  background: pearl.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const ResearchOutputPage: React.FC<ResearchOutputResponse> = ({
  title,
  text,
}) => {
  return (
    <div css={[containerStyles]}>
      <TagLabel>Proposal</TagLabel>
      <Display>{title}</Display>
      <RichText toc text={text} />
    </div>
  );
};

export default ResearchOutputPage;

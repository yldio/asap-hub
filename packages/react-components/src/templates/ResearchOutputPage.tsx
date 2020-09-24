import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Display, TagLabel, RichText } from '../atoms';
import { pearl } from '../colors';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  alignSelf: 'stretch',
  background: pearl.rgb,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const articleStyles = css({
  alignSelf: 'stretch',
});

const ResearchOutputPage: React.FC<ResearchOutputResponse> = ({
  title,
  text,
}) => {
  return (
    <div css={articleStyles}>
      <main css={[mainStyles]}>
        <TagLabel>Proposal</TagLabel>
        <Display>{title}</Display>
        <RichText toc text={text} />
      </main>
    </div>
  );
};

export default ResearchOutputPage;

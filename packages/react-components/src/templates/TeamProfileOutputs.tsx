import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { SharedResearchList } from '.';
import { perRem } from '../pixels';

const containerStyles = css({
  padding: `${36 / perRem}em 0`,
});

export type TeamProfileOutputsProps = Omit<
  ComponentProps<typeof SharedResearchList>,
  'children'
>;

const TeamProfileOutputs: React.FC<TeamProfileOutputsProps> = ({
  researchOutputs,
  numberOfItems,
  numberOfPages,
  currentPageIndex,
  renderPageHref,
  isListView,
  cardViewHref,
  exportResults,
  listViewHref,
}) => (
  <div css={containerStyles}>
    <SharedResearchList
      exportResults={exportResults}
      researchOutputs={researchOutputs}
      numberOfItems={numberOfItems}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPageIndex}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={cardViewHref}
      listViewHref={listViewHref}
    />
  </div>
);

export default TeamProfileOutputs;

import { isEnabled } from '@asap-hub/flags';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { SharedResearchList } from '.';
import { ComingSoon, SharedResearchCard } from '../organisms';
import { perRem } from '../pixels';

const containerStyles = css({
  padding: `${36 / perRem}em 0`,
});
const regressionListStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
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
    {isEnabled('ALGOLIA_RESEARCH_OUTPUTS') ? (
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
    ) : (
      <div css={regressionListStyles}>
        {researchOutputs.map((output) => (
          <SharedResearchCard {...output} key={output.id} />
        ))}
        <ComingSoon>
          As teams create and share more research outputs - such as datasets,
          protocols, code and other resources - they will be listed here. As
          information is shared, teams should be mindful to respect intellectual
          boundaries. No investigator or team should act on any of the
          privileged information shared within the Network without express
          permission from and credit to the investigator(s) that shared the
          information.
        </ComingSoon>
      </div>
    )}
  </div>
);
export default TeamProfileOutputs;

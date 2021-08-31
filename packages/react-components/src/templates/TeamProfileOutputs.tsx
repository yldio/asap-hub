import { isEnabled } from '@asap-hub/flags';
import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { ComingSoon, SharedResearchCard } from '../organisms';
import { perRem } from '../pixels';
import { SharedResearchList } from '.';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

export type TeamProfileOutputsProps = {
  outputs: ReadonlyArray<
    ComponentProps<typeof SharedResearchCard> & { id: string }
  >;
  numberOfPages?: number;
  currentPage?: number;
  isListView?: boolean;
  cardViewHref?: string;
  listViewHref?: string;
  renderPageHref?: (page: number) => string;
  numberOfItems?: number;
};

const TeamProfileOutputs: React.FC<TeamProfileOutputsProps> = ({
  outputs,
  numberOfPages = 0,
  currentPage = 0,
  isListView = false,
  cardViewHref = '',
  listViewHref = '',
  renderPageHref = () => '',
  numberOfItems = 0,
}) => {
  return (
    <div css={containerStyles}>
      {isEnabled('ALGOLIA_RESEARCH_OUTPUTS') ? (
        <SharedResearchList
          researchOutputs={outputs}
          numberOfItems={numberOfItems}
          numberOfPages={numberOfPages}
          currentPageIndex={currentPage}
          renderPageHref={renderPageHref}
          isListView={isListView}
          cardViewHref={cardViewHref}
          listViewHref={listViewHref}
        />
      ) : (
        outputs.map((output) => (
          <SharedResearchCard {...output} key={output.id} />
        ))
      )}
      <ComingSoon>
        As teams create and share more research outputs - such as datasets,
        protocols, code and other resources - they will be listed here. As
        information is shared, teams should be mindful to respect intellectual
        boundaries. No investigator or team should act on any of the privileged
        information shared within the Network without express permission from
        and credit to the investigator(s) that shared the information.
      </ComingSoon>
    </div>
  );
};

export default TeamProfileOutputs;

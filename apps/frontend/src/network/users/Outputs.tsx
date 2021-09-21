import { isEnabled } from '@asap-hub/flags';
import {
  ResearchOutputsSearch,
  ProfileCardList,
  ComingSoon,
  SharedResearchList,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import React from 'react';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';
import { SearchFrame } from '../../structure/Frame';

type OutputsListProps = {
  searchQuery: string;
  filters: Set<string>;
  userId: string;
};

type OutputsProps = {
  userId: string;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filters,
  userId,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    userId,
  });
  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <SharedResearchList
      researchOutputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={
        network({}).users({}).user({ userId }).outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({}).users({}).user({ userId }).outputs({}).$ + listViewParams
      }
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({ userId }) => {
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();

  return (
    <article>
      <ProfileCardList>
        {isEnabled('RESEARCH_OUTPUTS_ON_AUTHOR_PROFILE')
          ? [
              {
                card: (
                  <ResearchOutputsSearch
                    onChangeSearch={setSearchQuery}
                    searchQuery={searchQuery}
                    onChangeFilter={toggleFilter}
                    filters={filters}
                  />
                ),
              },

              {
                card: (
                  <SearchFrame title="outputs">
                    <OutputsList
                      userId={userId}
                      searchQuery={debouncedSearchQuery}
                      filters={filters}
                    />
                  </SearchFrame>
                ),
              },
            ]
          : [
              {
                card: (
                  <ComingSoon>
                    As individuals create and share more research outputs - such
                    as datasets, protocols, code and other resources - they will
                    be listed here. As information is shared, teams should be
                    mindful to respect intellectual boundaries. No investigator
                    or team should act on any of the privileged information
                    shared within the Network without express permission from
                    and credit to the investigator(s) that shared the
                    information.
                  </ComingSoon>
                ),
              },
            ]}
      </ProfileCardList>
    </article>
  );
};

export default Outputs;

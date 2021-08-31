import { TeamProfileOutputs } from '@asap-hub/react-components';
import { TeamProfileOutputsProps } from '@asap-hub/react-components/build/templates/TeamProfileOutputs';
import { Component, ComponentProps } from 'react';
import { isEnabled } from '@asap-hub/flags';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';
import { ResearchOutputResponse } from '@asap-hub/model';

type OutputsProps = {
  searchQuery: string;
  filters: Set<string>;
  teamId: string;
  teamOutputs: ReadonlyArray<ResearchOutputResponse>;
};

const Outputs: React.FC<OutputsProps> = ({
  searchQuery,
  filters,
  teamId,
  teamOutputs,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();
  const result = isEnabled('ALGOLIA_RESEARCH_OUTPUTS')
    ? useResearchOutputs({
        searchQuery,
        filters,
        currentPage,
        pageSize,
        teamId,
      })
    : {
        items: teamOutputs,
        total: teamOutputs.length,
      };

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <TeamProfileOutputs
      outputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPage={currentPage}
      isListView={isListView}
      cardViewHref={network({}).teams({}).team({ teamId }).$ + cardViewParams}
      listViewHref={network({}).teams({}).team({ teamId }).$ + listViewParams}
      renderPageHref={renderPageHref}
    />
  );
};

export default Outputs;

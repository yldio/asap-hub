import { TeamProfileOutputs } from '@asap-hub/react-components';
import { ResearchOutputResponse } from '@asap-hub/model';
import { isEnabled } from '@asap-hub/flags';
import { network } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';

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
  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    teamId,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <TeamProfileOutputs
      outputs={
        isEnabled('ALGOLIA_RESEARCH_OUTPUTS') ? result.items : teamOutputs
      }
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPage={currentPage}
      isListView={isListView}
      cardViewHref={
        network({}).teams({}).team({ teamId }).outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({}).teams({}).team({ teamId }).outputs({}).$ + listViewParams
      }
      renderPageHref={renderPageHref}
    />
  );
};

export default Outputs;

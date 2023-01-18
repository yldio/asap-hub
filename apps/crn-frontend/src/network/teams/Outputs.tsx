import { RESEARCH_OUTPUT_ENTITY_TYPE } from '@asap-hub/algolia';
import { createCsvFileStream, SearchFrame } from '@asap-hub/frontend-utils';
import {
  ProfileOutputs,
  ResearchOutputsSearch,
  utils,
} from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import format from 'date-fns/format';
import { ComponentProps } from 'react';
import { TeamResponse } from '@asap-hub/model';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';

import { useAlgolia } from '../../hooks/algolia';
import { getResearchOutputs } from '../../shared-research/api';
import {
  algoliaResultsToStream,
  researchOutputToCSV,
} from '../../shared-research/export';

type OutputsListProps = Pick<
  ComponentProps<typeof ProfileOutputs>,
  'userAssociationMember' | 'contactEmail'
> & {
  displayName: string;
  searchQuery: string;
  filters: Set<string>;
  teamId: string;
};
type OutputsProps = {
  team: TeamResponse;
};

const OutputsList: React.FC<OutputsListProps> = ({
  searchQuery,
  filters,
  teamId,
  userAssociationMember,
  contactEmail,
  displayName,
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
  const { client } = useAlgolia();
  const exportResults = () =>
    algoliaResultsToStream<typeof RESEARCH_OUTPUT_ENTITY_TYPE>(
      createCsvFileStream(
        `SharedOutputs_Team${utils
          .titleCase(displayName)
          .replace(/[\W_]+/g, '')}_${format(new Date(), 'MMddyy')}.csv`,
        { header: true },
      ),
      (paginationParams) =>
        getResearchOutputs(client, {
          filters,
          searchQuery,
          teamId,
          ...paginationParams,
        }),
      researchOutputToCSV,
    );
  return (
    <ProfileOutputs
      researchOutputs={result.items}
      exportResults={exportResults}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={
        network({}).teams({}).team({ teamId }).outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({}).teams({}).team({ teamId }).outputs({}).$ + listViewParams
      }
      userAssociationMember={userAssociationMember}
      contactEmail={contactEmail}
      publishingEntity="Team"
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({ team }) => {
  const {
    filters,
    searchQuery,
    toggleFilter,
    setSearchQuery,
    debouncedSearchQuery,
  } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const hasOutputs = !!useResearchOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage,
    pageSize,
    teamId: team.id,
  }).total;

  const userAssociationMember = (useCurrentUserCRN()?.teams ?? []).some(
    ({ id }) => id === team.id,
  );
  return (
    <article>
      {hasOutputs && (
        <ResearchOutputsSearch
          onChangeSearch={setSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={toggleFilter}
          filters={filters}
        />
      )}
      <SearchFrame title="">
        <OutputsList
          teamId={team.id}
          searchQuery={debouncedSearchQuery}
          filters={filters}
          userAssociationMember={userAssociationMember}
          contactEmail={team?.pointOfContact?.email}
          displayName={team?.displayName ?? ''}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;

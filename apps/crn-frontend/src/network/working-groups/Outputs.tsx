import { SearchFrame } from '@asap-hub/frontend-utils';
import { WorkingGroupDataObject } from '@asap-hub/model';
import { ProfileOutputs } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { ComponentProps } from 'react';

import { usePagination, usePaginationParams } from '../../hooks';
import { useResearchOutputs } from '../../shared-research/state';

type OutputsListProps = Pick<
  ComponentProps<typeof ProfileOutputs>,
  'userAssociationMember'
> & {
  displayName: string;
  searchQuery: string;
  filters: Set<string>;
  workingGroupId: string;
};
type OutputsProps = {
  workingGroup: WorkingGroupDataObject;
};

const OutputsList: React.FC<OutputsListProps> = ({
  workingGroupId,
  userAssociationMember,
  searchQuery,
  filters,
}) => {
  const { currentPage, pageSize, isListView, cardViewParams, listViewParams } =
    usePaginationParams();

  const result = useResearchOutputs({
    searchQuery,
    filters,
    currentPage,
    pageSize,
    workingGroupId,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );
  return (
    <ProfileOutputs
      researchOutputs={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isListView={isListView}
      cardViewHref={
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .outputs({}).$ + cardViewParams
      }
      listViewHref={
        network({})
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .outputs({}).$ + listViewParams
      }
      userAssociationMember={userAssociationMember}
      workingGroupAssociation
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({ workingGroup }) => {
  const currentUserId = useCurrentUserCRN()?.id;
  const userAssociationMember = workingGroup.members.some(
    (member) => member.user.id === currentUserId,
  );

  return (
    <article>
      <SearchFrame title="">
        <OutputsList
          workingGroupId={workingGroup.id}
          searchQuery={''}
          filters={new Set()}
          displayName={workingGroup.title}
          userAssociationMember={userAssociationMember}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;

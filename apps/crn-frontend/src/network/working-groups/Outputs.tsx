import { SearchFrame } from '@asap-hub/frontend-utils';
import { ProfileOutputs } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { ComponentProps } from 'react';

import { usePagination, usePaginationParams } from '../../hooks';
import { useWorkingGroupById } from './state';

type OutputsListProps = Pick<
  ComponentProps<typeof ProfileOutputs>,
  'hasOutputs' | 'ownEntity'
> & {
  displayName: string;
  searchQuery: string;
  filters: Set<string>;
  workingGroupId: string;
};
type OutputsProps = {
  workingGroupId: string;
};

const OutputsList: React.FC<OutputsListProps> = ({
  workingGroupId,
  hasOutputs,
  ownEntity,
}) => {
  const { currentPage, isListView, cardViewParams, listViewParams } =
    usePaginationParams();
  const { numberOfPages, renderPageHref } = usePagination(0, 10);
  return (
    <ProfileOutputs
      researchOutputs={[]}
      numberOfItems={0}
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
      hasOutputs={hasOutputs}
      ownEntity={ownEntity}
      publishingEntity={'Working Group'}
    />
  );
};

const Outputs: React.FC<OutputsProps> = ({ workingGroupId }) => {
  const hasOutputs = false;
  const workingGroup = useWorkingGroupById(workingGroupId);

  const currentUserId = useCurrentUserCRN()?.id;
  const ownWorkingGroup = !!useWorkingGroupById(workingGroupId)?.members.filter(
    (member) => member.user.id === currentUserId,
  ).length;
  return (
    <article>
      <SearchFrame title="">
        <OutputsList
          workingGroupId={workingGroupId}
          searchQuery={''}
          filters={new Set()}
          hasOutputs={hasOutputs}
          displayName={workingGroup?.title ?? ''}
          ownEntity={ownWorkingGroup}
        />
      </SearchFrame>
    </article>
  );
};
export default Outputs;

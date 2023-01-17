import { gp2 as gp2Model } from '@asap-hub/model';
import { FetchUsersFilter } from '@asap-hub/model/src/gp2';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { FilterPill } from '../molecules';

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  paddingTop: rem(24),
});

interface FilterPillsProps {
  filters: FetchUsersFilter;
  projects: Pick<gp2Model.ProjectResponse, 'id' | 'title'>[];
  workingGroups: Pick<gp2Model.WorkingGroupResponse, 'id' | 'title'>[];
  onApplyClick: (filters: gp2Model.FetchUsersFilter) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  projects,
  workingGroups,
  onApplyClick,
}) => {
  const entityToSelect = <T extends { title: string; id: string }>({
    title,
    id,
  }: T) => ({ label: title, value: id });

  const addWorkingGroupLabel = function (filter: string) {
    let workingGroup = { label: '', value: '' };
    const workingGroupIndex = workingGroups.findIndex(
      (workingGroup) => workingGroup.id === filter,
    );
    if (workingGroupIndex) {
      workingGroup = entityToSelect(workingGroups[workingGroupIndex]);
    }
    return workingGroup;
  };

  const addProjectLabel = function (filter: string) {
    let project = { label: '', value: '' };
    const projectIndex = projects.findIndex((project) => project.id === filter);
    if (projectIndex) {
      project = entityToSelect(projects[projectIndex]);
    }
    return project;
  };

  return (
    <div css={containerStyles}>
      {filters.regions?.map((filter, index) => (
        <FilterPill
          key={`region-${index}`}
          filter={entityToSelect({ title: filter, id: filter })}
          onApplyClick={async () => {
            const regions =
              filters.regions === undefined
                ? []
                : filters.regions.filter((f) => f === filter);
            onApplyClick({
              regions: regions,
              keywords: filters.keywords,
              projects: projects.map(({ id }) => id),
              workingGroups: workingGroups.map(({ id }) => id),
            });
          }}
        />
      ))}
      {filters.keywords?.map((filter, index) => (
        <FilterPill
          key={`keyword-${index}`}
          filter={entityToSelect({ title: filter, id: filter })}
          onApplyClick={() => {}}
        />
      ))}
      {filters.projects?.map((filter, index) => (
        <FilterPill
          key={`project-${index}`}
          filter={addWorkingGroupLabel(filter)}
          onApplyClick={() => {}}
        />
      ))}
      {filters.workingGroups?.map((filter, index) => (
        <FilterPill
          key={`workingGroup-${index}`}
          filter={addProjectLabel(filter)}
          onApplyClick={() => {}}
        />
      ))}
    </div>
  );
};

export default FilterPills;

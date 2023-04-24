import { gp2 as gp2Model } from '@asap-hub/model';
import { pixels, Tag } from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { rem } = pixels;

type FiltersType = Pick<
  gp2Model.FetchUsersFilter,
  'keywords' | 'regions' | 'workingGroups' | 'projects'
>;

type FilterType = keyof FiltersType;
type ProjectsType = Pick<gp2Model.ProjectResponse, 'id' | 'title'>[];
type WorkingGroupsType = Pick<gp2Model.WorkingGroupResponse, 'id' | 'title'>[];

type FilterPillsProps = {
  filters: FiltersType;
  projects: ProjectsType;
  workingGroups: WorkingGroupsType;
  onRemove: (id: string, typeOfFilter: FilterType) => void;
};

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',
  gap: rem(8),
  paddingTop: rem(24),
  ':empty': {
    display: 'none',
  },
});

const getLabelFromArray = (
  array: ProjectsType | WorkingGroupsType,
  id: string,
) => {
  const index = array.findIndex((elem) => elem.id === id);

  return array[index]?.title ?? '';
};

const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  workingGroups,
  projects,
  onRemove,
}) => (
  <div css={containerStyles}>
    {filters.keywords?.map((filter: string) => (
      <Tag
        key={`filter-pill-${filter}`}
        onRemove={() => onRemove(filter, 'keywords')}
      >
        {filter}
      </Tag>
    ))}
    {filters.regions?.map((filter: string) => (
      <Tag
        key={`filter-pill-${filter}`}
        onRemove={() => onRemove(filter, 'regions')}
      >
        {filter}
      </Tag>
    ))}
    {filters.workingGroups?.map((filter: string) => (
      <Tag
        key={`filter-pill-${filter}`}
        onRemove={() => onRemove(filter, 'workingGroups')}
      >
        {getLabelFromArray(workingGroups, filter)}
      </Tag>
    ))}
    {filters.projects?.map((filter: string) => (
      <Tag
        key={`filter-pill-${filter}`}
        onRemove={() => onRemove(filter, 'projects')}
      >
        {getLabelFromArray(projects, filter)}
      </Tag>
    ))}
  </div>
);

export default FilterPills;

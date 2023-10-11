import { gp2 as gp2Model } from '@asap-hub/model';
import { pixels, Tag } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { useMemo } from 'react';

const { rem } = pixels;

type FiltersType = Pick<
  gp2Model.FetchUsersFilter,
  'tags' | 'regions' | 'workingGroups' | 'projects'
>;

type FilterType = keyof FiltersType;
type ProjectsType = Pick<gp2Model.ProjectResponse, 'id' | 'title'>[];
type WorkingGroupsType = Pick<gp2Model.WorkingGroupResponse, 'id' | 'title'>[];

type FilterPillsProps = {
  filters: FiltersType;
  projects: ProjectsType;
  workingGroups: WorkingGroupsType;
  tags: gp2Model.TagResponse[];
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

const getArrayLookup = (array: ProjectsType | WorkingGroupsType) => {
  const lookup = Object.fromEntries(array.map(({ id, title }) => [id, title]));
  return (id: string) => lookup[id] ?? '';
};

const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  workingGroups,
  projects,
  tags,
  onRemove,
}) => {
  const lookupTag = useMemo(
    () => getArrayLookup(tags.map(({ id, name }) => ({ id, title: name }))),
    [tags],
  );
  const lookupWorkingGroup = useMemo(
    () => getArrayLookup(workingGroups),
    [workingGroups],
  );
  const lookupProject = useMemo(() => getArrayLookup(projects), [projects]);
  return (
    <div css={containerStyles}>
      {filters.tags?.map((filter: string) => (
        <Tag
          key={`filter-pill-${filter}`}
          onRemove={() => onRemove(filter, 'tags')}
        >
          {lookupTag(filter)}
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
          {lookupWorkingGroup(filter)}
        </Tag>
      ))}
      {filters.projects?.map((filter: string) => (
        <Tag
          key={`filter-pill-${filter}`}
          onRemove={() => onRemove(filter, 'projects')}
        >
          {lookupProject(filter)}
        </Tag>
      ))}
    </div>
  );
};

export default FilterPills;

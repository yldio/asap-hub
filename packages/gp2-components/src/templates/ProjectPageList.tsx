import { gp2 as gp2Model } from '@asap-hub/model';
import { SearchAndFilter } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

type ProjectPageListProps = {
  hasProjects: boolean;
} & Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;

const projectFilters = [
  { title: 'STATUS' },
  ...gp2Model.projectStatus.map((value) => ({ label: value, value })),
  { title: 'TYPE' },
  {
    label: gp2Model.opportunitiesAvailable,
    value: gp2Model.opportunitiesAvailable,
  },
  { label: gp2Model.traineeProject, value: gp2Model.traineeProject },
];

const ProjectPageList: React.FC<ProjectPageListProps> = ({
  children,
  filters,
  onChangeFilter,
  onChangeSearch,
  searchQuery,
  hasProjects,
}) => (
  <>
    {hasProjects && (
      <SearchAndFilter
        onChangeSearch={onChangeSearch}
        searchPlaceholder="Enter name..."
        searchQuery={searchQuery}
        onChangeFilter={onChangeFilter}
        filterOptions={projectFilters}
        filters={filters}
      />
    )}
    <main>{children}</main>
  </>
);

export default ProjectPageList;

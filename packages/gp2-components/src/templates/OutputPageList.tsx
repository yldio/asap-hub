import { gp2 as gp2Model } from '@asap-hub/model';
import { Filter } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import FilterSearchExport from '../organisms/FilterSearchExport';

type OutputPageListProps = {
  hasOutputs: boolean;
} & ComponentProps<typeof FilterSearchExport> &
  Pick<ComponentProps<typeof Filter>, 'onChangeFilter' | 'filters'>;

interface Option<V extends string> {
  value: V;
  label: string;
  enabled?: boolean;
}
interface Title {
  title: string;
  label?: undefined;
}

const outputFilters: ReadonlyArray<
  Option<gp2Model.OutputDocumentType> | Title
> = [
  { title: 'TYPE OF OUTPUT' },
  ...gp2Model.outputDocumentTypes.map((value) => ({ label: value, value })),
];

const OutputPageList: React.FC<OutputPageListProps> = ({
  children,
  filters,
  onChangeFilter,
  onFiltersClick,
  onSearchQueryChange,
  onExportClick,
  isAdministrator,
  searchQuery,
  hasOutputs,
}) => (
  <>
    {hasOutputs && (
      <FilterSearchExport
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onFiltersClick={onFiltersClick}
        onExportClick={onExportClick}
        isAdministrator={isAdministrator}
        useFilterComponent
        filters={filters}
        filterOptions={outputFilters}
        onChangeFilter={onChangeFilter}
      />
    )}
    <main>{children}</main>
  </>
);

export default OutputPageList;

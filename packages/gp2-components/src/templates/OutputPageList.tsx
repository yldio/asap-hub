import { gp2 as gp2Model } from '@asap-hub/model';
import { Filter } from '@asap-hub/react-components/src/organisms';
import { ComponentProps } from 'react';
import FilterSearchExport from '../organisms/FilterSearchExport';

type OutputPageListProps = {
  hasOutputs: boolean;
  filters?: Set<string>;
} & ComponentProps<typeof FilterSearchExport>;

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
  onFiltersClick,
  onSearchQueryChange,
  onExportClick,
  searchQuery,
  hasOutputs,
  isAdministrator,
}) => (
  <>
    {hasOutputs && (
      <>
        <FilterSearchExport
          onSearchQueryChange={onSearchQueryChange}
          searchQuery={searchQuery}
          onFiltersClick={onFiltersClick}
          onExportClick={onExportClick}
          isAdministrator={isAdministrator}
        />
        <Filter
          filters={filters}
          onChangeFilter={onFiltersClick}
          filterOptions={outputFilters}
        />
      </>
    )}
    <main>{children}</main>
  </>
);

export default OutputPageList;

import {
  ResearchOutputDocumentType,
  ResearchOutputFilterOptionTypes,
  ResearchOutputPublishingEntities,
} from '@asap-hub/model';
import { SearchAndFilter } from '../organisms';
import { Option, Title } from '../organisms/CheckboxGroup';

export type ResearchOutputsSearchProps = {
  onChangeSearch: (newSearchQuery: string) => void;
  searchQuery: string;
  onChangeFilter: (filter: string) => void;
  filters: Set<string>;
  filterOptions?: ReadonlyArray<
    Option<ResearchOutputFilterOptionTypes> | Title
  >;
};

export const sourceFilters: ReadonlyArray<
  Option<ResearchOutputPublishingEntities> | Title
> = [
  { title: 'SOURCE' },
  { label: 'Teams', value: 'Team', filterName: 'source' },
  { label: 'Working Groups', value: 'Working Group', filterName: 'source' },
];

export const outputTypeFilters: ReadonlyArray<
  Option<ResearchOutputDocumentType> | Title
> = [
  { title: 'TYPE OF OUTPUTS' },
  { label: 'Article', value: 'Article', filterName: 'documentType' },
  {
    label: 'Bioinformatics',
    value: 'Bioinformatics',
    filterName: 'documentType',
  },
  { label: 'CRN Report', value: 'Report', filterName: 'documentType' },
  { label: 'Dataset', value: 'Dataset', filterName: 'documentType' },
  {
    label: 'Grant Document',
    value: 'Grant Document',
    filterName: 'documentType',
  },
  { label: 'Lab Material', value: 'Lab Material', filterName: 'documentType' },
  { label: 'Presentation', value: 'Presentation', filterName: 'documentType' },
  { label: 'Protocol', value: 'Protocol', filterName: 'documentType' },
];

export const researchOutputFilters: ReadonlyArray<
  Option<ResearchOutputFilterOptionTypes> | Title
> = [...sourceFilters, ...outputTypeFilters];

const ResearchOutputsSearch: React.FC<ResearchOutputsSearchProps> = ({
  onChangeSearch,
  searchQuery,
  onChangeFilter,
  filters,
  filterOptions = researchOutputFilters,
}) => (
  <SearchAndFilter
    searchPlaceholder="Enter a keyword, method, resource…"
    onChangeSearch={onChangeSearch}
    searchQuery={searchQuery}
    filterOptions={filterOptions}
    onChangeFilter={onChangeFilter}
    filters={filters}
  />
);

export default ResearchOutputsSearch;

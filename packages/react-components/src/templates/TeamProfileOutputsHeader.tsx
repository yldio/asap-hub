import { SearchAndFilter } from '../organisms';
import { researchOutputFilters } from './SharedResearchPageHeader';

export type TeamProfileOutputsHeaderProps = {
  setSearchQuery: (newSearchQuery: string) => void;
  searchQuery: string;
  onChangeFilter: (filter: string) => void;
  filters: Set<string>;
};

const TeamProfileOutputsHeader: React.FC<TeamProfileOutputsHeaderProps> = ({
  setSearchQuery,
  searchQuery,
  onChangeFilter,
  filters,
}) => (
  <SearchAndFilter
    searchPlaceholder="Enter a keyword, method, resource…"
    onChangeSearch={setSearchQuery}
    searchQuery={searchQuery}
    filterOptions={researchOutputFilters}
    filterTitle="TYPE OF OUTPUTS"
    onChangeFilter={onChangeFilter}
    filters={filters}
  />
);

export default TeamProfileOutputsHeader;

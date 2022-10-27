import { Headline3, Paragraph } from '@asap-hub/react-components';

type FilterModalHeaderProps = {
  numberOfFilter: number;
};

const FilterModalHeader: React.FC<FilterModalHeaderProps> = ({
  numberOfFilter,
}) => (
  <>
    <Headline3>Filters</Headline3>
    <Paragraph accent="lead">
      Apply filters to narrow down your search results. You currently have{' '}
      <strong>{numberOfFilter}</strong> filter{numberOfFilter === 1 ? '' : 's'}{' '}
      selected.
    </Paragraph>
  </>
);

export default FilterModalHeader;

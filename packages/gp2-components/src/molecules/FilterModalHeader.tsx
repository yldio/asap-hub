import { Headline3, Paragraph } from '@asap-hub/react-components';
import { padding24Styles } from '../layout';

type FilterModalHeaderProps = {
  numberOfFilter: number;
};

const FilterModalHeader: React.FC<FilterModalHeaderProps> = ({
  numberOfFilter,
}) => (
  <header css={padding24Styles}>
    <Headline3>Filters</Headline3>
    <Paragraph accent="lead">
      Apply filters to narrow down your search results. You currently have{' '}
      <strong>{numberOfFilter}</strong> filter{numberOfFilter === 1 ? '' : 's'}{' '}
      selected.
    </Paragraph>
  </header>
);

export default FilterModalHeader;

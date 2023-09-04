import { css } from '@emotion/react';

import { Display, MultiSelect, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import {
  contentSidePaddingWithNavigation,
  networkContentTopPadding,
} from '../layout';
import { searchIcon } from '../icons';

import { noop } from '../utils';

const visualHeaderStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});
const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const controlsStyles = css({
  padding: `${networkContentTopPadding} ${contentSidePaddingWithNavigation(
    8,
  )} 0`,
});

type TagsPageHeaderProps = {
  tags: [string, string][];
  setTags?: (tags: [string, string][]) => void;
  showSearch?: boolean;
};

const TagsPageHeader: React.FC<TagsPageHeaderProps> = ({
  tags,
  setTags = noop,
  showSearch = true,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Tags Search</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Search for all CRN Hub areas that include selected tags.
        </Paragraph>
      </div>
    </div>
    {showSearch && (
      <div css={controlsStyles}>
        <MultiSelect
          leftIndicator={searchIcon}
          noOptionsMessage={() => 'No results found'}
          loadOptions={async () =>
            Promise.resolve([
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
              { label: 'c', value: 'c' },
              { label: 'd', value: 'd' },
            ])
          }
          onChange={(items) =>
            setTags(items.map(({ label, value }) => [label, value]))
          }
          values={tags.map(([label, value]) => ({
            label,
            value,
          }))}
          placeholder="Search for any tags..."
        />
      </div>
    )}
  </header>
);

export default TagsPageHeader;

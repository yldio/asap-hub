import { css } from '@emotion/react';
import { ComponentProps } from 'react';

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
  tags: string[];
  setTags?: (tags: string[]) => void;
  loadTags?: ComponentProps<typeof MultiSelect>['loadOptions'];
};

const TagsPageHeader: React.FC<TagsPageHeaderProps> = ({
  tags,
  setTags = noop,
  loadTags = noop,
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
    <div css={controlsStyles}>
      <MultiSelect
        leftIndicator={searchIcon}
        noOptionsMessage={() => 'No results found'}
        loadOptions={loadTags}
        onChange={(items) => setTags(items.map(({ value }) => value))}
        values={tags.map((tag) => ({
          label: tag,
          value: tag,
        }))}
        key={tags.join(',')} // Force re-render to refresh default options. (https://github.com/JedWatson/react-select/discussions/5389)
        placeholder="Search for any tags..."
      />
    </div>
  </header>
);

export default TagsPageHeader;

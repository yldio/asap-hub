import { css } from '@emotion/react';
import {
  components,
  GroupBase,
  MultiValueGenericProps,
  OptionProps,
} from 'react-select';

import { Pill } from '../atoms';
import { charcoal } from '../colors';
import { rem } from '../pixels';
import { getMultiValueStyles } from '../select';
import type { ResearchOutputOption } from './research-output-form';

const optionGridStyles = (showPill: boolean) =>
  css({
    display: 'grid',
    gridTemplateColumns: `min-content${showPill ? ' min-content' : ''} auto`,
    justifyItems: 'start',
    alignItems: 'top',
    alignContent: 'center',
    columnGap: '12px',
  });

const articleSelectIconStyles = css({
  svg: {
    width: '18px',
    height: '18px',
    paddingLeft: rem(3),
    paddingTop: rem(4.5),
    stroke: charcoal.rgb,
    strokeWidth: rem(0.3),
  },
});

type CreateArticleSelectComponentsOptions<T extends ResearchOutputOption> = {
  getIcon: (data: T) => React.ReactNode;
  showArticlePill: (data: T) => boolean;
};

export const createArticleSelectComponents = <T extends ResearchOutputOption>({
  getIcon,
  showArticlePill,
}: CreateArticleSelectComponentsOptions<T>) => ({
  MultiValueContainer: (
    multiValueContainerProps: MultiValueGenericProps<T, true, GroupBase<T>>,
  ) => (
    <div
      css={{
        ...getMultiValueStyles(multiValueContainerProps.selectProps.styles),
        paddingLeft: rem(8),
      }}
    >
      {multiValueContainerProps.children}
    </div>
  ),
  MultiValueLabel: (
    multiValueLabelProps: MultiValueGenericProps<T, true, GroupBase<T>>,
  ) => (
    <components.MultiValueLabel {...multiValueLabelProps}>
      <div css={optionGridStyles(showArticlePill(multiValueLabelProps.data))}>
        <div css={articleSelectIconStyles}>
          {getIcon(multiValueLabelProps.data)}
        </div>
        {showArticlePill(multiValueLabelProps.data) && (
          <Pill accent="gray">{multiValueLabelProps.data.type}</Pill>
        )}
        <span>{multiValueLabelProps.children}</span>
      </div>
    </components.MultiValueLabel>
  ),
  Option: (optionProps: OptionProps<T, true, GroupBase<T>>) => (
    <components.Option {...optionProps}>
      <div css={optionGridStyles(showArticlePill(optionProps.data))}>
        <div css={articleSelectIconStyles}>{getIcon(optionProps.data)}</div>
        {showArticlePill(optionProps.data) && (
          <Pill accent="gray">{optionProps.data.type}</Pill>
        )}
        <div>{optionProps.children}</div>
      </div>
    </components.Option>
  ),
});

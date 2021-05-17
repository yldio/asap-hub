import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Card, Headline2, Divider } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, TagList } from '../molecules';
import { RichText, SharedResearchOutputHeaderCard } from '../organisms';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type SharedResearchOutputProps = Pick<
  ResearchOutputResponse,
  'description' | 'tags' | 'accessInstructions'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  };

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description,
  backHref,
  tags,
  accessInstructions,
  ...props
}) => (
  <div css={containerStyles}>
    <BackLink href={backHref} />
    <div css={cardsStyles}>
      <SharedResearchOutputHeaderCard {...props} />
      {(description || !!tags.length) && (
        <Card>
          {description && (
            <div css={{ paddingBottom: `${12 / perRem}em` }}>
              <Headline2 styleAsHeading={4}>Description</Headline2>
              <RichText poorText text={description} />
            </div>
          )}
          {description && !!tags.length && <Divider />}
          {!!tags.length && (
            <>
              <Headline2 styleAsHeading={4}>Tags</Headline2>
              <TagList tags={tags} />
            </>
          )}
        </Card>
      )}
      {accessInstructions && (
        <Card>
          <div css={{ paddingBottom: `${12 / perRem}em` }}>
            <Headline2 styleAsHeading={4}>Access Instructions</Headline2>
            <RichText poorText text={accessInstructions} />
          </div>
        </Card>
      )}
    </div>
  </div>
);

export default SharedResearchOutput;

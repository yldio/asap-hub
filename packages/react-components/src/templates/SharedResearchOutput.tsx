import { ComponentProps } from 'react';
import { css } from '@emotion/react';
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
  maxWidth: '100%',
  overflow: 'hidden',
});

const additionalInformationListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${6 / perRem}em 0`,
});
const additionalInformationEntryStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${6 / perRem}em 0`,
});

type SharedResearchOutputProps = Pick<
  ResearchOutputResponse,
  | 'description'
  | 'tags'
  | 'accessInstructions'
  | 'sharingStatus'
  | 'asapFunded'
  | 'usedInPublication'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  };

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description,
  backHref,
  tags,
  accessInstructions,
  sharingStatus,
  asapFunded,
  usedInPublication,
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
      <Card>
        <Headline2 styleAsHeading={4}>Additional Information</Headline2>
        <ol css={additionalInformationListStyles}>
          <li css={additionalInformationEntryStyles}>
            <strong>Sharing Status</strong>
            <span>{sharingStatus}</span>
          </li>
          {asapFunded === undefined || (
            <>
              <Divider />
              <li css={additionalInformationEntryStyles}>
                <strong>ASAP Funded</strong>
                <span>{asapFunded ? 'Yes' : 'No'}</span>
              </li>
            </>
          )}
          {usedInPublication === undefined || (
            <>
              <Divider />
              <li css={additionalInformationEntryStyles}>
                <strong>Used in a Publication</strong>
                <span>{usedInPublication ? 'Yes' : 'No'}</span>
              </li>
            </>
          )}
        </ol>
      </Card>
    </div>
  </div>
);

export default SharedResearchOutput;

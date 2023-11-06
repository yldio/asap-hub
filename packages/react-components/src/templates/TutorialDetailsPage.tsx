import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { TutorialsResponse } from '@asap-hub/model';

import { Card, Headline2, Divider, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { TagList } from '../molecules';
import {
  RelatedTutorialsCard,
  RichText,
  TutorialAdditionalInformationCard,
  TutorialHeaderCard,
  RelatedEventsCard,
  HelpSection,
} from '../organisms';

const containerStyles = css({
  padding: defaultPageLayoutPaddingStyle,
});

const tagsContainer = css({
  margin: `${12 / perRem}em 0 ${12 / perRem}em 0`,
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type TutorialDetailsPageProps = Pick<
  TutorialsResponse,
  'text' | 'tags' | 'relatedTutorials' | 'relatedEvents'
> &
  ComponentProps<typeof TutorialHeaderCard> &
  ComponentProps<typeof TutorialAdditionalInformationCard>;

const TutorialDetailsPage: React.FC<TutorialDetailsPageProps> = ({
  text,
  relatedTutorials,
  relatedEvents,
  tags,
  ...props
}) => {
  const hasAdditionalInformation = [
    props.asapFunded,
    props.sharingStatus,
    props.usedInPublication,
  ].some((info) => info != null);

  return (
    <div css={containerStyles}>
      <div css={cardsStyles}>
        <TutorialHeaderCard {...props} />
        {(text || !!tags.length) && (
          <Card>
            {text && (
              <div css={{ paddingBottom: `${12 / perRem}em` }}>
                <Headline2>Description</Headline2>
                <RichText poorText text={text} />
              </div>
            )}
            {text && !!tags.length && <Divider />}
            {!!tags.length && (
              <>
                <Headline2>Tags</Headline2>
                <Paragraph noMargin accent="lead">
                  Explore keywords related to skills, techniques, resources, and
                  tools.
                </Paragraph>
                <div css={tagsContainer}>
                  <TagList tags={tags} />
                </div>
              </>
            )}
          </Card>
        )}
        {!!relatedTutorials.length && (
          <RelatedTutorialsCard
            relatedTutorials={relatedTutorials}
            truncateFrom={3}
          />
        )}
        {!!relatedEvents.length && (
          <RelatedEventsCard relatedEvents={relatedEvents} truncateFrom={3} />
        )}
        {hasAdditionalInformation && (
          <TutorialAdditionalInformationCard {...props} />
        )}
        <HelpSection />
      </div>
    </div>
  );
};
export default TutorialDetailsPage;

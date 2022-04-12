import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Card, Headline2, Divider } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, CtaCard, TagList } from '../molecules';
import {
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchOutputHeaderCard,
} from '../organisms';
import { createMailTo } from '../mail';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type SharedResearchOutputProps = Pick<
  ResearchOutputResponse,
  'description' | 'tags' | 'accessInstructions' | 'contactEmails'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  } & ComponentProps<typeof SharedResearchAdditionalInformationCard>;

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description,
  backHref,
  tags,
  accessInstructions,
  contactEmails,
  ...props
}) => {
  const isGrantDocument = ['Grant Document', 'Presentation'].includes(
    props.documentType,
  );
  return (
    <div css={containerStyles}>
      <BackLink href={backHref} />
      <div css={cardsStyles}>
        <SharedResearchOutputHeaderCard {...props} />
        {((description && !isGrantDocument) || !!tags.length) && (
          <Card>
            {description && !isGrantDocument && (
              <div css={{ paddingBottom: `${12 / perRem}em` }}>
                <Headline2 styleAsHeading={4}>Description</Headline2>
                <RichText poorText text={description} />
              </div>
            )}
            {description && !isGrantDocument && !!tags.length && <Divider />}
            {!!tags.length && (
              <>
                <Headline2 styleAsHeading={4}>Tags</Headline2>
                <TagList tags={tags} />
              </>
            )}
          </Card>
        )}
        {!isGrantDocument && accessInstructions && (
          <Card>
            <div css={{ paddingBottom: `${12 / perRem}em` }}>
              <Headline2 styleAsHeading={4}>Access Instructions</Headline2>
              <RichText poorText text={accessInstructions} />
            </div>
          </Card>
        )}
        {!isGrantDocument && (
          <SharedResearchAdditionalInformationCard {...props} />
        )}
        {description && isGrantDocument && (
          <Card>
            <RichText toc text={description} />
          </Card>
        )}
        {!!contactEmails.length && (
          <CtaCard href={createMailTo(contactEmails)} buttonText="Contact PM">
            <strong>Interested in what you have seen?</strong>
            <br /> Reach out to the PMs associated with this output
          </CtaCard>
        )}
      </div>
    </div>
  );
};
export default SharedResearchOutput;

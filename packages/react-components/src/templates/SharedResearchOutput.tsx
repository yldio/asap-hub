import React, { ComponentProps, useContext } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Headline2, Divider, Link } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  BackLink,
  CtaCard,
  SharedResearchOutputBanner,
  TagList,
} from '../molecules';
import {
  RelatedResearch,
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchOutputHeaderCard,
} from '../organisms';
import { createMailTo } from '../mail';
import { editIcon } from '..';
import { getResearchOutputAssociation } from '../utils';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const buttonsContainer = css({
  display: 'flex',
  justifyContent: 'space-between',
});
const editButtonContainer = css({ margin: 'auto 0' });

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type SharedResearchOutputProps = Pick<
  ResearchOutputResponse,
  | 'description'
  | 'tags'
  | 'usageNotes'
  | 'contactEmails'
  | 'methods'
  | 'organisms'
  | 'environments'
  | 'subtype'
  | 'id'
  | 'relatedResearch'
  | 'published'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  } & ComponentProps<typeof SharedResearchAdditionalInformationCard> & {
    isPublishedNow: boolean;
  };

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description,
  backHref,
  usageNotes,
  contactEmails,
  id,
  relatedResearch,
  published,
  isPublishedNow,
  ...props
}) => {
  const isGrantDocument = ['Grant Document', 'Presentation'].includes(
    props.documentType,
  );

  const tags = [
    ...props.methods,
    ...props.organisms,
    ...props.environments,
    ...(props.subtype ? [props.subtype] : []),
    ...props.tags,
  ];

  const { canEditResearchOutput } = useContext(
    ResearchOutputPermissionsContext,
  );
  const association = getResearchOutputAssociation(props);

  return (
    <div>
      {(isPublishedNow || !published) && (
        <SharedResearchOutputBanner
          published={published}
          isPublishedNow={isPublishedNow}
          documentType={props.documentType}
          association={association}
        />
      )}
      <div css={containerStyles}>
        <div css={buttonsContainer}>
          <BackLink href={backHref} />
          {canEditResearchOutput && !isGrantDocument && (
            <div css={editButtonContainer}>
              <Link
                href={
                  sharedResearch({})
                    .researchOutput({ researchOutputId: id })
                    .editResearchOutput({}).$
                }
                buttonStyle
                small
                primary
              >
                {editIcon} Edit
              </Link>
            </div>
          )}
        </div>
        <div css={cardsStyles}>
          <SharedResearchOutputHeaderCard {...props} published={published} />
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
          {!isGrantDocument && usageNotes && (
            <Card>
              <div css={{ paddingBottom: `${12 / perRem}em` }}>
                <Headline2 styleAsHeading={4}>Usage Notes</Headline2>
                <RichText poorText text={usageNotes} />
              </div>
            </Card>
          )}
          {!isGrantDocument && relatedResearch?.length > 0 && (
            <RelatedResearch relatedResearch={relatedResearch} />
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
    </div>
  );
};
export default SharedResearchOutput;

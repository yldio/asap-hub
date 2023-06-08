import React, { ComponentProps, useContext, useState } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network, sharedResearch } from '@asap-hub/routing';

import { Card, Headline2, Divider, Link, Markdown, Button } from '../atoms';
import { mobileScreen, perRem, rem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { CtaCard, TagList } from '../molecules';
import {
  ConfirmModal,
  RelatedResearch,
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchOutputHeaderCard,
  Toast,
} from '../organisms';
import { createMailTo } from '../mail';
import { editIcon, steel } from '..';
import { getResearchOutputAssociation } from '../utils';
import { actionIcon, duplicateIcon } from '../icons';

/*
  1. Ask Tiff about error message
  2. §Permissions (don't show button if currentUser is PM)
  3. styiling cleanup
  4. SharedResearchOutput unit tests
  5. 
*/

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const buttonsContainer = css({
  display: 'flex',
  flexFlow: 'column',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row',
  },
  gap: rem(16),
  paddingBottom: rem(32),
});

const childButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    maxWidth: rem(300),
  },
});

const reviewButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  alignSelf: 'flex-end',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    maxWidth: rem(300),
  },
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: rem(12),
    paddingTop: rem(28),
    borderTop: `1px solid ${steel.rgb}`,
  },
  strokeWidth: 0,
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type SharedResearchOutputProps = Pick<
  ResearchOutputResponse,
  | 'description'
  | 'descriptionMD'
  | 'keywords'
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
    publishedNow: boolean;
    draftCreated?: boolean;
  };

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description = '',
  descriptionMD = '',
  backHref,
  usageNotes,
  contactEmails,
  id,
  relatedResearch,
  published,
  publishedNow,
  draftCreated,
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
    ...props.keywords,
  ];
  const { canEditResearchOutput, canDuplicateResearchOutput } = useContext(
    ResearchOutputPermissionsContext,
  );

  const hasDescription = description || descriptionMD;

  const association = getResearchOutputAssociation(props);
  const [publishedNowBanner, setPublishedNowBanner] = useState(published);
  const [draftCreatedBanner, setDraftCreatedBanner] = useState(draftCreated);
  const [displayModal, setDisplayModal] = useState(false);

  const duplicateLink =
    props.workingGroups && props.workingGroups[0].id
      ? network({})
          .workingGroups({})
          .workingGroup({
            workingGroupId: props.workingGroups[0].id,
          })
          .duplicateOutput({
            id,
          }).$
      : props.teams[0] && props.teams[0].id
      ? network({})
          .teams({})
          .team({ teamId: props.teams[0].id })
          .duplicateOutput({ id }).$
      : undefined;

  return (
    <div>
      {draftCreatedBanner && (
        <Toast
          accent="successLarge"
          onClose={() => setDraftCreatedBanner(false)}
        >
          {`Draft ${
            association === 'working group' ? 'Working Group' : 'Team'
          } ${props.documentType} created successfully.`}
        </Toast>
      )}
      {(publishedNow || !published) && (
        <div>
          {publishedNowBanner && (
            <Toast
              accent="successLarge"
              onClose={() => setPublishedNowBanner(false)}
            >
              {`${
                association === 'working group' ? 'Working Group' : 'Team '
              } ${props.documentType} published successfully.`}
            </Toast>
          )}
          {!published && (
            <Toast accent="warning">{`This draft is available to members in the ${association}
   listed below. Only PMs can publish this output.`}</Toast>
          )}
        </div>
      )}
      <div css={containerStyles}>
        {!isGrantDocument && (
          <div css={buttonsContainer}>
            {canEditResearchOutput && (
              <div css={childButton}>
                <Link
                  noMargin
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
            {canDuplicateResearchOutput && duplicateLink && (
              <div css={childButton}>
                <Link noMargin href={duplicateLink} buttonStyle small primary>
                  {duplicateIcon} Duplicate
                </Link>
              </div>
            )}
            {!published && (
              <div css={reviewButton}>
                <Button
                  noMargin
                  small
                  primary
                  onClick={() => setDisplayModal(!displayModal)}
                >
                  {actionIcon} Ready for PM Review
                </Button>
              </div>
            )}
          </div>
        )}
        {displayModal && (
          <ConfirmModal
            title="Output Ready for PM Review?"
            description="All team members listed on this output will be notified and PMs will be able to review and publish this output."
            cancelText="Cancel"
            confirmText="Ready for PM Review"
            onSave={() => {
              setDisplayModal(false);
            }}
            onCancel={() => {
              setDisplayModal(false);
            }}
          />
        )}
        <div css={cardsStyles}>
          <SharedResearchOutputHeaderCard {...props} published={published} />
          {((hasDescription && !isGrantDocument) || !!tags.length) && (
            <Card>
              {hasDescription && !isGrantDocument && (
                <div css={{ paddingBottom: `${12 / perRem}em` }}>
                  <Headline2 styleAsHeading={4}>Description</Headline2>
                  <Markdown value={descriptionMD}></Markdown>
                  {descriptionMD === '' && (
                    <RichText poorText text={description} />
                  )}
                </div>
              )}
              {hasDescription && !isGrantDocument && !!tags.length && (
                <Divider />
              )}
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
          {hasDescription && isGrantDocument && (
            <Card>
              <Markdown value={descriptionMD} toc></Markdown>
              {!descriptionMD && <RichText toc text={description} />}
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

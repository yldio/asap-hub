import React, { ComponentProps, useContext, useState } from 'react';
import { css } from '@emotion/react';
import {
  ResearchOutputPutRequest,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';

import { Card, Headline2, Divider, Markdown } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { CtaCard, TagList } from '../molecules';
import {
  ConfirmModal,
  RelatedResearch,
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchOutputBanners,
  SharedResearchOutputButtons,
  SharedResearchOutputHeaderCard,
} from '../organisms';
import { createMailTo } from '../mail';
import {
  getResearchOutputAssociation,
  transformResearchOutputResponseToRequest,
} from '../utils';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
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
  | 'reviewRequestedBy'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  } & ComponentProps<typeof SharedResearchAdditionalInformationCard> & {
    publishedNow: boolean;
    draftCreated?: boolean;
    rod?: ResearchOutputResponse;
    currentUserId?: string;
    onRequestReview?: (
      output: ResearchOutputPutRequest,
    ) => Promise<ResearchOutputResponse | void>;
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
  rod,
  currentUserId,
  reviewRequestedBy,
  onRequestReview,
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
  const {
    canEditResearchOutput,
    canDuplicateResearchOutput,
    canRequestReview,
    canPublishResearchOutput,
  } = useContext(ResearchOutputPermissionsContext);

  const hasDescription = description || descriptionMD;

  const association = getResearchOutputAssociation(props);
  const [publishedNowBanner, setPublishedNowBanner] = useState(published);
  const [draftCreatedBanner, setDraftCreatedBanner] = useState(draftCreated);
  const [reviewRequestedBanner, setReviewRequestedBanner] = useState(false);
  const [reviewDismissedBanner, setReviewDismissedBanner] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const toggleReview = async (shouldReview: boolean) => {
    if (!rod || !currentUserId || !onRequestReview) return;

    const req = {
      ...transformResearchOutputResponseToRequest(rod),
      reviewRequestedBy: shouldReview ? currentUserId : undefined,
    };

    await onRequestReview(req);

    setDisplayModal(false);
    setReviewRequestedBanner(shouldReview);
    setReviewDismissedBanner(!shouldReview);
  };

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
      <SharedResearchOutputBanners
        draftCreatedBanner={draftCreatedBanner}
        setDraftCreatedBanner={setDraftCreatedBanner}
        reviewRequestedBanner={reviewRequestedBanner}
        setReviewRequestedBanner={setReviewRequestedBanner}
        reviewDismissedBanner={reviewDismissedBanner}
        setReviewDismissedBanner={setReviewDismissedBanner}
        association={association}
        documentType={props.documentType}
        publishedNowBanner={publishedNowBanner}
        setPublishedNowBanner={setPublishedNowBanner}
        published={published}
        reviewRequestedBy={reviewRequestedBy}
        publishedNow={publishedNow}
      />
      <div css={containerStyles}>
        {!isGrantDocument && (
          <SharedResearchOutputButtons
            canEditResearchOutput={canEditResearchOutput}
            canDuplicateResearchOutput={canDuplicateResearchOutput}
            canRequestReview={canRequestReview}
            canPublishResearchOutput={canPublishResearchOutput}
            id={id}
            displayModal={displayModal}
            setDisplayModal={setDisplayModal}
            reviewRequestedBy={reviewRequestedBy}
            duplicateLink={duplicateLink}
            published={published}
          />
        )}
        {displayModal && (
          <ConfirmModal
            title={`${
              reviewRequestedBy
                ? 'Switch output to Draft?'
                : 'Output ready for PM review?'
            }`}
            description={`All ${
              association === 'working group' ? 'working group' : 'team'
            } members listed on this output will be notified and PMs will be able to review and publish this output.`}
            cancelText="Cancel"
            confirmText={`${
              reviewRequestedBy ? 'Switch to Draft' : 'Ready for PM Review'
            }`}
            onSave={() => toggleReview(reviewRequestedBy ? false : true)}
            onCancel={() => {
              setDisplayModal(false);
            }}
          />
        )}
        <div css={cardsStyles}>
          <SharedResearchOutputHeaderCard
            {...props}
            published={published}
            reviewRequestedBy={reviewRequestedBy}
          />
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

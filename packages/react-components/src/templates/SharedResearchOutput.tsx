import React, { ComponentProps, useState } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';

import { Card, Headline2, Divider, Markdown, Link } from '../atoms';
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
  RelatedEventsCard,
} from '../organisms';
import { createMailTo, TECH_SUPPORT_EMAIL, mailToSupport } from '../mail';
import {
  getResearchOutputAssociation,
  getResearchOutputAssociationName,
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
  | 'relatedEvents'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  } & ComponentProps<typeof SharedResearchAdditionalInformationCard> & {
    publishedNow: boolean;
    draftCreated?: boolean;
    onRequestReview?: (
      shouldReview: boolean,
    ) => Promise<ResearchOutputResponse | void>;
    onPublish?: () => Promise<ResearchOutputResponse | void>;
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
  reviewRequestedBy,
  relatedEvents,
  onRequestReview,
  onPublish,
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

  const hasDescription = description || descriptionMD;
  const association = getResearchOutputAssociation(props);
  const associationName = getResearchOutputAssociationName(props);
  const [reviewToggled, setReviewToggled] = useState(false);
  const [displayReviewModal, setDisplayReviewModal] = useState(false);
  const [displayPublishModal, setDisplayPublishModal] = useState(false);

  const toggleReview = async (shouldReview: boolean) => {
    if (!onRequestReview) return;

    await onRequestReview(shouldReview);

    setDisplayReviewModal(false);
    setReviewToggled(true);
  };

  const publishOutput = async () => {
    if (!onPublish) return;
    await onPublish();
    setDisplayPublishModal(false);
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
        published={published}
        draftCreated={draftCreated}
        association={association}
        documentType={props.documentType}
        reviewRequestedBy={reviewRequestedBy}
        publishedNow={publishedNow}
        reviewToggled={reviewToggled}
        associationName={associationName}
      />
      <div css={containerStyles}>
        {!isGrantDocument && (
          <SharedResearchOutputButtons
            id={id}
            displayReviewModal={displayReviewModal}
            setDisplayReviewModal={setDisplayReviewModal}
            reviewRequestedBy={reviewRequestedBy}
            duplicateLink={duplicateLink}
            published={published}
            displayPublishModal={displayPublishModal}
            setDisplayPublishModal={setDisplayPublishModal}
          />
        )}
        {displayReviewModal && (
          <ConfirmModal
            title={`${
              reviewRequestedBy
                ? 'Switch output to draft?'
                : 'Output ready for PM review?'
            }`}
            description={`All ${
              association === 'working group' ? 'working group' : 'team'
            } members listed on this output will be notified and ${
              reviewRequestedBy
                ? 'will be able to edit this output again.'
                : 'PMs will be able to review and publish this output.'
            }`}
            cancelText="Cancel"
            confirmText={`${
              reviewRequestedBy ? 'Switch to Draft' : 'Ready for PM Review'
            }`}
            onSave={() => toggleReview(!reviewRequestedBy)}
            onCancel={() => {
              setDisplayReviewModal(false);
            }}
          />
        )}
        {displayPublishModal && (
          <ConfirmModal
            title={'Publish output for the whole hub?'}
            description={
              <>
                {`All ${
                  association === 'working group' ? 'working group' : 'team'
                } members listed on this output will be notified and all
                CRN members will be able to access it. If you want to switch to
                draft after the output was published you need to contact`}
                <Link href={mailToSupport()}> {TECH_SUPPORT_EMAIL}</Link>.
              </>
            }
            cancelText="Cancel"
            confirmText="Publish Output"
            onSave={() => publishOutput()}
            successHref={
              sharedResearch({})
                .researchOutput({ researchOutputId: id })
                .researchOutputPublished({}).$
            }
            onCancel={() => {
              setDisplayPublishModal(false);
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
            <RelatedEventsCard relatedEvents={relatedEvents} truncateFrom={3} />
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

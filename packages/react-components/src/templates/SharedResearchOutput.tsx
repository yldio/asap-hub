import { ResearchOutputResponse } from '@asap-hub/model';
import { networkRoutes, sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { ComponentProps, useState } from 'react';

import { Card, Headline2, Link, Markdown } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';
import { createMailTo, mailToSupport, TECH_SUPPORT_EMAIL } from '../mail';
import { CtaCard } from '../molecules';
import {
  ConfirmModal,
  OutputVersions,
  RelatedEventsCard,
  RelatedResearchCard,
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchDetailsTagsCard,
  SharedResearchOutputBanners,
  SharedResearchOutputButtons,
  SharedResearchOutputHeaderCard,
} from '../organisms';
import { perRem } from '../pixels';
import {
  getIconForDocumentType as getIconForDocumentTypeCRN,
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
  | 'usageNotesMD'
  | 'contactEmails'
  | 'methods'
  | 'organisms'
  | 'environments'
  | 'subtype'
  | 'id'
  | 'relatedResearch'
  | 'published'
  | 'relatedEvents'
  | 'statusChangedBy'
  | 'isInReview'
  | 'versions'
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
  usageNotes = '',
  usageNotesMD = '',
  contactEmails,
  id,
  relatedResearch,
  published,
  publishedNow,
  draftCreated,
  relatedEvents,
  statusChangedBy,
  isInReview,
  onRequestReview,
  versions,
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
  const displayDescription = hasDescription && !isGrantDocument;
  const hasUsageNotes = usageNotes || usageNotesMD;
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
      ? // TODO: fix this
        networkRoutes.DEFAULT.path
      : // network({})
        //     .workingGroups({})
        //     .workingGroup({
        //       workingGroupId: props.workingGroups[0].id,
        //     })
        //     .duplicateOutput({
        //       id,
        //     }).$
        props.teams[0] && props.teams[0].id
        ? // TODO: fix this
          networkRoutes.DEFAULT.path
        : // network({})
          //     .teams({})
          //     .team({ teamId: props.teams[0].id })
          //     .duplicateOutput({ id }).$
          undefined;

  return (
    <div>
      <SharedResearchOutputBanners
        published={published}
        draftCreated={draftCreated}
        association={association}
        documentType={props.documentType}
        statusChangedBy={statusChangedBy}
        publishedNow={publishedNow}
        reviewToggled={reviewToggled}
        associationName={associationName}
        isInReview={isInReview}
      />
      <div css={containerStyles}>
        {!isGrantDocument && (
          <SharedResearchOutputButtons
            id={id}
            displayReviewModal={displayReviewModal}
            setDisplayReviewModal={setDisplayReviewModal}
            isInReview={isInReview}
            duplicateLink={duplicateLink}
            published={published}
            displayPublishModal={displayPublishModal}
            setDisplayPublishModal={setDisplayPublishModal}
          />
        )}
        {displayReviewModal && (
          <ConfirmModal
            title={`${
              isInReview
                ? 'Switch output to draft?'
                : 'Output ready for PM review?'
            }`}
            description={`All ${
              association === 'working group' ? 'working group' : 'team'
            } members listed on this output will be notified and ${
              isInReview
                ? 'will be able to edit this output again.'
                : 'PMs will be able to review and publish this output.'
            }`}
            cancelText="Cancel"
            confirmText={`${
              isInReview ? 'Switch to Draft' : 'Ready for PM Review'
            }`}
            onSave={() => toggleReview(!isInReview)}
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
            isInReview={isInReview}
          />
          {(displayDescription || !!tags.length) && (
            <SharedResearchDetailsTagsCard
              tags={tags}
              displayDescription={!!displayDescription}
              description={description}
              descriptionMD={descriptionMD}
            />
          )}
          {!isGrantDocument && hasUsageNotes && (
            <Card>
              <div css={{ paddingBottom: `${12 / perRem}em` }}>
                <Headline2 styleAsHeading={4}>Usage Notes</Headline2>
                <Markdown value={usageNotesMD}></Markdown>
                {!usageNotesMD && <RichText poorText text={usageNotes} />}
              </div>
            </Card>
          )}
          {!isGrantDocument && relatedResearch?.length > 0 && (
            <RelatedResearchCard
              description="Find out all shared research outputs that contributed to this one."
              relatedResearch={relatedResearch}
              getIconForDocumentType={getIconForDocumentTypeCRN}
            />
          )}
          {versions.length > 0 && <OutputVersions versions={versions} />}
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
            <CtaCard
              href={createMailTo(contactEmails)}
              buttonText="Contact PM"
              displayCopy
            >
              <strong>Have additional questions?</strong>
              <br /> The project managers associated with this output are here
              to help.
            </CtaCard>
          )}
        </div>
      </div>
    </div>
  );
};
export default SharedResearchOutput;

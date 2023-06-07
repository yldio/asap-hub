import React, { ComponentProps, useContext, useState } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { sharedResearch, network } from '@asap-hub/routing';

import { Card, Headline2, Divider, Link, Markdown, Button } from '../atoms';
import { mobileScreen, perRem, rem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { CtaCard, TagList } from '../molecules';
import {
  RelatedResearch,
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchOutputHeaderCard,
  Toast,
} from '../organisms';
import { createMailTo } from '../mail';
import { editIcon } from '..';
import { getResearchOutputAssociation } from '../utils';
import { actionIcon, duplicateIcon } from '../icons';
import { useLocation } from 'react-router-dom';

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
    '& > *:last-child': {
      alignSelf: 'flex-end',
      marginLeft: 'auto',
    },
  },
  gap: rem(16),
  paddingBottom: rem(32),
});

const childButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: rem(300),
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

  const urlSearchParams = new URLSearchParams(useLocation().search);
  const hasDescription = description || descriptionMD;

  const association = getResearchOutputAssociation(props);
  const [publishedNowBanner, setPublishedNowBanner] = useState(published);
  const [draftCreated, setDraftCreated] = useState(
    urlSearchParams.get('draftCreated') === 'true',
  );

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
      {draftCreated && (
        <Toast accent="successLarge" onClose={() => setDraftCreated(false)}>
          {`Draft ${
            association === 'working group' ? 'Working Group' : 'Team '
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
            <div css={childButton}>
              <Button noMargin small primary>
                {actionIcon} Ready for PM Review
              </Button>
            </div>
          </div>
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

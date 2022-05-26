import React, { ComponentProps, useContext } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';

import { Card, Headline2, Divider, Link } from '../atoms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, CtaCard, TagList } from '../molecules';
import {
  RichText,
  SharedResearchAdditionalInformationCard,
  SharedResearchOutputHeaderCard,
} from '../organisms';
import { createMailTo } from '../mail';
import { editIcon } from '..';

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
  | 'accessInstructions'
  | 'contactEmails'
  | 'methods'
  | 'organisms'
  | 'environments'
  | 'subtype'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  } & ComponentProps<typeof SharedResearchAdditionalInformationCard>;

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description,
  backHref,
  accessInstructions,
  contactEmails,
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

  const { canCreateUpdate } = useContext(ResearchOutputPermissionsContext);
  return (
    <div css={containerStyles}>
      <div css={buttonsContainer}>
        <BackLink href={backHref} />
        {canCreateUpdate && (
          <div css={editButtonContainer}>
            <Link href={'/'} buttonStyle small primary>
              {editIcon} Edit
            </Link>
          </div>
        )}
      </div>
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

import { css } from '@emotion/react';
import { TutorialsResponse } from '@asap-hub/model';
import { network, discover } from '@asap-hub/routing';

import { Card, Paragraph } from '../atoms';
import { perRem, smallDesktopScreen } from '../pixels';
import { formatDate } from '../date';
import { trainingPlaceholderIcon } from '../icons';
import {
  ExternalLink,
  LinkHeadline,
  ImageLink,
  UsersList,
  AssociationList,
  TagList,
} from '../molecules';
import { lead } from '..';
import { captionStyles } from '../text';

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${6 / perRem}em`,
  height: `${184 / perRem}em`,
  marginTop: `${9 / perRem}em`,
  marginBottom: `${3 / perRem}em`,

  marginRight: `${24 / perRem}em`,
  width: `${184 / perRem}em`,
  overflow: 'hidden',

  [`@media (max-width: ${smallDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const headerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

const associationsContainer = css({
  margin: `${24 / perRem}em 0 ${12 / perRem}em 0`,
});

const cardStyle = css({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: `${6 / perRem}em`,
});

const containerStyle = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const footerStyles = css({
  ...captionStyles,
  color: lead.rgb,
  justifySelf: 'flex-end',
});

type TutorialCardProps = Pick<
  TutorialsResponse,
  | 'addedDate'
  | 'authors'
  | 'created'
  | 'id'
  | 'link'
  | 'linkText'
  | 'teams'
  | 'shortText'
  | 'thumbnail'
  | 'title'
  | 'tags'
>;

const TutorialCard: React.FC<TutorialCardProps> = ({
  id,
  title,
  thumbnail,
  link,
  linkText,
  shortText,
  created,
  addedDate,
  authors,
  teams,
  tags,
}) => {
  const href = discover({}).tutorials({}).tutorial({ tutorialId: id }).$;

  const tutorialImage = (
    <>
      {thumbnail ? (
        <img
          alt={`"${title}"'s thumbnail`}
          src={thumbnail}
          css={[imageStyle]}
        />
      ) : (
        trainingPlaceholderIcon
      )}
    </>
  );

  return (
    <Card>
      <div css={cardStyle}>
        <div css={imageContainerStyle}>
          <ImageLink link={href}>{tutorialImage}</ImageLink>
        </div>
        <div css={containerStyle}>
          <div css={headerStyles}>
            <div css={{ paddingRight: `${15 / perRem}em` }}>
              <LinkHeadline href={href} level={4}>
                {title}
              </LinkHeadline>
            </div>
            {link ? <ExternalLink label={linkText} href={link} /> : null}
          </div>
          <div css={{ flex: 1 }}>
            <Paragraph accent="lead">{shortText}</Paragraph>
          </div>
          {!!authors.length && (
            <div css={associationsContainer}>
              <UsersList
                max={3}
                users={authors.map((author) => ({
                  ...author,
                  href:
                    author.id &&
                    network({}).users({}).user({ userId: author.id }).$,
                }))}
              />
            </div>
          )}
          {!!teams.length && (
            <AssociationList type="Team" inline max={3} associations={teams} />
          )}
          {!!tags.length && (
            <div css={associationsContainer}>
              <TagList max={3} tags={tags} />
            </div>
          )}
          <span css={footerStyles}>
            Posted: {formatDate(new Date(addedDate || created))}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TutorialCard;
